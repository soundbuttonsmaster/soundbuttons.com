"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { Heart, Loader2, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiClient, type SoundComment as SoundCommentType } from "@/lib/api/client"
import type { StringsSoundDetailDiscussion } from "@/lib/i18n/strings"

const PAGE_SIZE = 5

const AVATAR_COLORS = [
  "bg-fuchsia-500",
  "bg-violet-500",
  "bg-indigo-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
]

function getAvatarColor(username: string): string {
  let n = 0
  for (let i = 0; i < username.length; i++) n += username.charCodeAt(i)
  return AVATAR_COLORS[Math.abs(n) % AVATAR_COLORS.length]!
}

/** Circular avatar: first letter of username or person icon. No profile image from API yet. */
function CommentAvatar({ username, size = "md" }: { username: string; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm"
  const initial = (username || "?").charAt(0).toUpperCase()
  const color = getAvatarColor(username || "?")

  return (
    <div
      className={`${sizeClass} shrink-0 rounded-full ${color} flex items-center justify-center font-semibold text-white select-none`}
      aria-hidden
    >
      {initial}
    </div>
  )
}

function formatRelativeTime(createdAt: string, t: StringsSoundDetailDiscussion): string {
  const date = new Date(createdAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return t.justNow
  if (diffMins < 60) return t.minutesAgo.replace("{n}", String(diffMins))
  if (diffHours < 24) return t.hoursAgo.replace("{n}", String(diffHours))
  return t.daysAgo.replace("{n}", String(diffDays))
}

/** Renders relative time only after mount to avoid server/client date locale mismatch (hydration error). */
function RelativeTime({
  createdAt,
  t,
}: {
  createdAt: string
  t: StringsSoundDetailDiscussion
}) {
  const [mounted, setMounted] = useState(false)
  const [label, setLabel] = useState(t.justNow)
  useEffect(() => {
    setMounted(true)
    setLabel(formatRelativeTime(createdAt, t))
  }, [createdAt, t])
  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => setLabel(formatRelativeTime(createdAt, t)), 60000)
    return () => clearInterval(interval)
  }, [mounted, createdAt, t])
  return <span className="text-xs text-slate-500 dark:text-slate-400">{mounted ? label : t.justNow}</span>
}

interface CommentItemProps {
  comment: SoundCommentType
  t: StringsSoundDetailDiscussion
  isLoggedIn: boolean
  onLike: (commentId: number) => void
  onReply: (commentId: number) => void
  onPostReply: (parentId: number, body: string) => Promise<void>
  replyingToId: number | null
  setReplyingToId: (id: number | null) => void
  replyLoading: boolean
  isReply?: boolean
}

function CommentItem({
  comment,
  t,
  isLoggedIn,
  onLike,
  onReply,
  onPostReply,
  replyingToId,
  setReplyingToId,
  replyLoading,
  isReply = false,
}: CommentItemProps) {
  const [replyText, setReplyText] = useState("")
  const showReplyForm = replyingToId === comment.id

  const handleSubmitReply = async () => {
    const body = replyText.trim()
    if (!body) return
    await onPostReply(comment.id, body)
    setReplyText("")
    setReplyingToId(null)
  }

  return (
    <div className={isReply ? "mt-4 ml-10 flex gap-3" : "flex gap-3 py-3 first:pt-0 border-b border-slate-100 dark:border-slate-700/80 last:border-b-0"}>
      {/* Left: avatar */}
      <CommentAvatar username={comment.user.username} size={isReply ? "sm" : "md"} />

      {/* Middle: content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="font-semibold text-slate-900 dark:text-white text-sm">
            {comment.user.username}
          </span>
          {comment.user.current_streak != null && comment.user.current_streak > 0 && (
            <span className="inline-flex items-center gap-0.5 text-orange-500 dark:text-orange-400 text-xs font-medium" title="Streak">
              <Flame className="h-3.5 w-3.5 shrink-0" />
              <span className="tabular-nums">{comment.user.current_streak}</span>
            </span>
          )}
          <span className="text-slate-400 dark:text-slate-500 text-xs">·</span>
          <time dateTime={comment.created_at}>
            <RelativeTime createdAt={comment.created_at} t={t} />
          </time>
        </div>
        <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
          {comment.body}
        </p>
        {!isReply && (
          <button
            type="button"
            onClick={() => (showReplyForm ? setReplyingToId(null) : onReply(comment.id))}
            className="mt-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
            aria-label={t.reply}
          >
            {t.reply}
          </button>
        )}

        {showReplyForm && (
          <div className="mt-3 flex gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 min-w-0 resize-none rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"
              rows={2}
              disabled={replyLoading}
            />
            <Button
              type="button"
              size="sm"
              onClick={handleSubmitReply}
              disabled={replyLoading || !replyText.trim()}
              className="shrink-0 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 text-xs font-semibold"
            >
              {replyLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : t.submit}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => { setReplyingToId(null); setReplyText("") }}
              disabled={replyLoading}
              className="shrink-0 h-8 text-xs text-slate-500 dark:text-slate-400 rounded-full"
            >
              {t.cancel}
            </Button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((r) => (
              <CommentItem
                key={r.id}
                comment={r}
                t={t}
                isLoggedIn={isLoggedIn}
                onLike={onLike}
                onReply={onReply}
                onPostReply={onPostReply}
                replyingToId={replyingToId}
                setReplyingToId={setReplyingToId}
                replyLoading={replyLoading}
                isReply
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: likes */}
      <div className="flex flex-col items-center shrink-0 w-10">
        <button
          type="button"
          onClick={() => isLoggedIn && onLike(comment.id)}
          className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!isLoggedIn}
          aria-label={t.like}
        >
          {comment.is_liked ? (
            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
          ) : (
            <Heart className="h-5 w-5" />
          )}
        </button>
        {comment.likes_count > 0 && (
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {comment.likes_count}
          </span>
        )}
      </div>
    </div>
  )
}

const QUICK_EMOJIS = ["😂", "❤️", "🔥", "👏", "😍", "👍", "🎉", "🙌"]

export interface SoundDiscussionProps {
  soundId: number
  initialComments: SoundCommentType[]
  initialTotal: number
  locale: string
  token: string | null
  loginHref: string
  t: StringsSoundDetailDiscussion
  /** Current user username for avatar in input row */
  currentUsername?: string | null
  /** Auth state restored (e.g. from localStorage). When false, show placeholder to avoid CLS. */
  authReady?: boolean
}

export function SoundDiscussion({
  soundId,
  initialComments,
  initialTotal,
  locale,
  token,
  loginHref,
  t,
  currentUsername = null,
  authReady = true,
}: SoundDiscussionProps) {
  const [comments, setComments] = useState<SoundCommentType[]>(initialComments)
  const [totalCount, setTotalCount] = useState(initialTotal)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [posting, setPosting] = useState(false)
  const [replyingToId, setReplyingToId] = useState<number | null>(null)
  const [replyLoading, setReplyLoading] = useState(false)
  const [newCommentText, setNewCommentText] = useState("")
  const [likePending, setLikePending] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const hasMore = comments.length < totalCount
  const isLoggedIn = !!token
  const showInput = authReady

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    setError(null)
    try {
      const nextPage = page + 1
      const res = await apiClient.getSoundComments(soundId, nextPage, PAGE_SIZE, token ?? undefined)
      if (res.success && res.results?.length) {
        setComments((prev) => [...prev, ...res.results!])
        setPage(nextPage)
      }
    } catch {
      setError(t.errorPosting)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, page, soundId, token, t.errorPosting])

  const updateCommentInTree = useCallback(
    (list: SoundCommentType[], commentId: number, updater: (c: SoundCommentType) => SoundCommentType): SoundCommentType[] => {
      return list.map((c) => {
        if (c.id === commentId) return updater(c)
        if (c.replies?.length) {
          return { ...c, replies: updateCommentInTree(c.replies, commentId, updater) }
        }
        return c
      })
    },
    []
  )

  const findComment = useCallback((list: SoundCommentType[], id: number): SoundCommentType | null => {
    for (const c of list) {
      if (c.id === id) return c
      if (c.replies?.length) {
        const found = findComment(c.replies, id)
        if (found) return found
      }
    }
    return null
  }, [])

  const handleLike = useCallback(
    async (commentId: number) => {
      if (!token) return
      const comment = findComment(comments, commentId)
      if (!comment) return
      const nextLiked = !comment.is_liked
      const nextCount = comment.likes_count + (nextLiked ? 1 : -1)
      const prevLiked = comment.is_liked
      const prevCount = comment.likes_count
      setLikePending((prev) => new Set(prev).add(commentId))
      setComments((prev) =>
        updateCommentInTree(prev, commentId, (c) => ({ ...c, is_liked: nextLiked, likes_count: nextCount }))
      )
      try {
        const res = nextLiked
          ? await apiClient.likeComment(commentId, token)
          : await apiClient.unlikeComment(commentId, token)
        if (!res.success) throw new Error(res.message)
      } catch {
        setComments((prev) =>
          updateCommentInTree(prev, commentId, (c) => ({ ...c, is_liked: prevLiked, likes_count: prevCount }))
        )
      } finally {
        setLikePending((prev) => {
          const next = new Set(prev)
          next.delete(commentId)
          return next
        })
      }
    },
    [token, comments, updateCommentInTree, findComment]
  )

  const handlePostComment = useCallback(async () => {
    const body = newCommentText.trim()
    if (!body || !token) return
    setPosting(true)
    setError(null)
    try {
      const res = await apiClient.postSoundComment(soundId, body, token)
      if (res.success && res.comment) {
        setComments((prev) => [res.comment!, ...prev])
        setTotalCount((n) => n + 1)
        setNewCommentText("")
      } else {
        setError(res.message ?? t.errorPosting)
      }
    } catch {
      setError(t.errorPosting)
    } finally {
      setPosting(false)
    }
  }, [newCommentText, token, soundId, t.errorPosting])

  const handlePostReply = useCallback(
    async (parentId: number, body: string) => {
      if (!token) return
      setReplyLoading(true)
      setError(null)
      try {
        const res = await apiClient.postSoundComment(soundId, body, token, parentId)
        if (res.success && res.comment) {
          setComments((prev) =>
            prev.map((c) => {
              if (c.id !== parentId) return c
              return { ...c, replies: [...(c.replies ?? []), res.comment!] }
            })
          )
          setTotalCount((n) => n + 1)
        } else {
          setError(res.message ?? t.errorPosting)
        }
      } catch {
        setError(t.errorPosting)
      } finally {
        setReplyLoading(false)
      }
    },
    [token, soundId, t.errorPosting]
  )

  return (
    <section
      className="mt-6 w-full rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/95 dark:shadow-none sm:p-6 p-4"
      aria-label={t.title}
    >
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
        {t.title}
      </h2>

      {/* Fixed min-height so layout doesn't shift when auth state loads (CLS fix) */}
      <div className="mb-4 min-h-[120px]">
        {!showInput ? (
          <div className="h-[120px] rounded-2xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" aria-hidden />
        ) : !isLoggedIn ? (
          <div className="rounded-2xl bg-slate-100 dark:bg-slate-800/80 px-4 py-3 min-h-[120px] flex items-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <Link
                href={loginHref}
                className="font-semibold text-slate-900 dark:text-white underline underline-offset-2 hover:no-underline"
              >
                {t.logInToComment}
              </Link>
            </p>
          </div>
        ) : (
          <div>
            {/* Emoji quick bar */}
            <div className="flex flex-wrap gap-1 mb-2">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setNewCommentText((prev) => prev + emoji)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label={`Add ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {/* Input row: avatar + pill input + post */}
            <div className="flex items-center gap-3">
              {currentUsername ? (
                <CommentAvatar username={currentUsername} size="md" />
              ) : (
                <div className="h-9 w-9 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden />
              )}
              <div className="flex-1 min-w-0 flex items-end gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 pl-4 pr-1 py-1.5 focus-within:ring-2 focus-within:ring-slate-300 dark:focus-within:ring-slate-600 focus-within:border-transparent">
                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={t.placeholder}
                  className="flex-1 min-w-0 resize-none bg-transparent py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none border-0 min-h-[40px]"
                  rows={2}
                  disabled={posting}
                />
                <Button
                  type="button"
                  onClick={handlePostComment}
                  disabled={posting || !newCommentText.trim()}
                  className="shrink-0 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-200"
                >
                  {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : t.postComment}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mb-3 text-sm text-red-600 dark:text-red-400 rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2" role="alert">
          {error}
        </p>
      )}

      <div className="min-h-[60px]">
        {comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
            No comments yet.
          </p>
        ) : (
          <ul className="list-none p-0 m-0 space-y-0">
            {comments.map((c) => (
              <li key={c.id}>
                <CommentItem
                  comment={c}
                  t={t}
                  isLoggedIn={isLoggedIn}
                  onLike={handleLike}
                  onReply={setReplyingToId}
                  onPostReply={handlePostReply}
                  replyingToId={replyingToId}
                  setReplyingToId={setReplyingToId}
                  replyLoading={replyLoading}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {hasMore && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-xl border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : t.loadMoreComments}
          </Button>
        </div>
      )}
    </section>
  )
}
