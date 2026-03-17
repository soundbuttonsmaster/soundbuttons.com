/**
 * Centralized UI strings per locale (en, es, pt, fr).
 * Content aligned with sbmain for locale pages.
 */

export type Locale = "en" | "es" | "pt" | "fr"

export interface StringsNav {
  home: string
  soundEffects: string
  new: string
  trending: string
  categories: string
  memeSoundboard: string
  playRandom: string
  addMoreFun: string
  aiSoundButtons: string
  textToSound: string
  leaderboard: string
  createSound: string
  kidsSoundboard: string
  searchPlaceholder: string
  joinFree: string
  login: string
  register: string
  upload: string
  menu: string
  signedInAs: string
  myProfile: string
  mySoundboard: string
  myFavorites: string
  logout: string
}

export interface StringsFooter {
  whyChoose: string
  specialPages: string
  categories: string
  support: string
  contactInfo: string
  viewAllCategories: string
  home: string
  soundButtonsUnblocked: string
  soundButtonsForSchool: string
  soundboard: string
  textToSound: string
  createSound: string
  playRandom: string
  newSoundButtons: string
  trending: string
  userReviews: string
  games: string
  kidsSoundboard: string
  soundEffects: string
  signIn: string
  createAccount: string
  aboutUs: string
  contactUs: string
  privacyPolicy: string
  termsOfUse: string
  siteMap: string
  downloadAppGoogle: string
  downloadAppApple: string
  whyChooseParagraph: string
}

export interface StringsHome {
  heroTitle: string
  heroDescription: string
  searchPlaceholder: string
  trendingTitle: string
  newTitle: string
  viewAll: string
  view: string
  loadMoreSounds: string
  aboutTitle: string
  autoPlay: string
  stopAuto: string
  randomPlay: string
  stopRandom: string
  /** Short labels for mobile (Auto, Stop, Random) */
  autoShort: string
  stopShort: string
  randomShort: string
}

export interface StringsSearch {
  pageTitle: string
  noResults: string
  loadMore: string
  /** Title for document/meta: "{query} - Sound Buttons | SoundButtons.com" */
  resultsTitleTemplate: string
  /** Hero: "{count} {query} Sound Buttons" */
  heroTitleTemplate: string
  /** Hero: "Found {count} sound buttons - free to play and download" */
  heroDescriptionTemplate: string
  searchMorePlaceholder: string
  /** List heading: "{query} Sound Buttons" */
  soundListTitleTemplate: string
  loadingMore: string
  scrollForMore: string
  browseCategories: string
  trendingSounds: string
  tryDifferentSearch: string
}

export interface StringsSoundDetail {
  youMightLike: string
  aboutThisSound: string
  howToUse: string
  popularUses: string
  exploreMoreSounds: string
  moreCategorySounds: string
  trending: string
  newSounds: string
  soundboard: string
  download: string
  share: string
  addToFavorites: string
  removeFromFavorites: string
  playInstantly: string
  downloadForFree: string
  useInContent: string
  shareWithFriends: string
}

export interface StringsCategory {
  categories: string
  subcategories: string
  exploreMore: string
  newSounds: string
  trending: string
  allCategories: string
}

export interface StringsCommon {
  loadMore: string
  viewAll: string
  loading: string
  noSoundsFound: string
}

export interface StringsAbout {
  aboutTitle: string
  authorCreator: string
  whyStartedTitle: string
  contactInfoTitle: string
}

/** Full About section content for home page - all translatable strings */
export interface StringsAboutContent {
  mainTitle: string
  tableOfContents: string
  tocIntroduction: string
  tocWhatAreSoundButtons: string
  tocWhatYouGet: string
  tocQualitySounds: string
  tocWorksEverywhere: string
  tocEasyToUse: string
  tocOrganization: string
  tocMemeSoundboard: string
  tocStreamers: string
  tocDiscord: string
  tocHowItWorks: string
  tocWhyExists: string
  tocFaq: string
  tocAboutContact: string
  welcomeBefore: string
  linkMemeSounds: string
  welcomeAfter: string
  welcomeParagraph2: string
  whatAreSoundButtonsTitle: string
  whatAreSoundButtonsPart1: string
  linkMemeSoundButtons: string
  whatAreSoundButtonsPart2: string
  linkFunnySoundButtons: string
  whatAreSoundButtonsPart3: string
  linkSoundEffects: string
  whatAreSoundButtonsPart4: string
  linkTrendingSoundButtons: string
  whatAreSoundButtonsPart5: string
  linkContentCreators: string
  whatAreSoundButtonsPart6: string
  whatYouGetTitle: string
  whatYouGetPart1: string
  linkTrendingSoundButtons2: string
  whatYouGetPart2: string
  qualitySoundsTitle: string
  qualitySoundsPart1: string
  linkMemeButtons: string
  qualitySoundsPart2: string
  worksEverywhereTitle: string
  worksEverywherePart1: string
  linkSoundboardUnblocked: string
  worksEverywherePart2: string
  easyToUseTitle: string
  easyToUseContent: string
  organizationTitle: string
  organizationIntro: string
  linkMemeSection: string
  organizationMemeDesc: string
  linkFunnyStuff: string
  organizationFunnyDesc: string
  linkGamingSounds: string
  organizationGamingDesc: string
  linkMovieTvClips: string
  organizationMovieDesc: string
  linkSoundEffects2: string
  organizationEffectsDesc: string
  memeSoundboardTitle: string
  memeSoundboardPart1: string
  linkMemeSoundboard: string
  memeSoundboardPart2: string
  linkMemeSoundboard2: string
  memeSoundboardPart3: string
  memeSoundboardPart4: string
  streamersTitle: string
  streamersPart1: string
  linkMemeButtons2: string
  streamersPart2: string
  discordTitle: string
  discordContent: string
  howItWorksTitle: string
  howItWorksStep1Label: string
  linkBrowseCategories: string
  howItWorksStep1Rest: string
  howItWorksStep2Label: string
  howItWorksStep2Rest: string
  howItWorksStep3Label: string
  howItWorksStep3Rest: string
  whyExistsTitle: string
  whyExistsParagraph1: string
  whyExistsParagraph2: string
  faqTitle: string
  faq1Question: string
  faq1Answer: string
  faq2Question: string
  faq2Answer: string
  faq3Question: string
  faq3Answer: string
  faq4Question: string
  faq4Answer: string
  founderLabel: string
  whyStartedP1: string
  whyStartedP2: string
  whyStartedP3: string
  whyStartedP4: string
  emailLabel: string
  phoneLabel: string
  addressLabel: string
  addressValue: string
  finalPart1: string
  linkCheckOutCollection: string
  finalPart2: string
  readIn: string
  langEn: string
  langEs: string
  langPt: string
  langFr: string
}

export interface StringsAiSoundButtons {
  heroTitle: string
  heroDescription: string
  quickQuestionsLabel: string
  inputPlaceholder: string
  ask: string
  sending: string
  thinking: string
  noMatch: string
  noSoundsInCategory: string
  errorMessage: string
  showMore: string
  showingXOfY: string
  soundButtonsLabel: string
  welcomeTitle: string
  welcomeSubtitle: string
  tryCategoryBelow: string
  hereAreCategory: string
  hereAreSearch: string
}

export interface LocaleStrings {
  nav: StringsNav
  footer: StringsFooter
  home: StringsHome
  search: StringsSearch
  soundDetail: StringsSoundDetail
  category: StringsCategory
  common: StringsCommon
  about: StringsAbout
  aboutContent: StringsAboutContent
  aiSoundButtons: StringsAiSoundButtons
}

const strings: Record<Locale, LocaleStrings> = {
  en: {
    nav: {
      home: "Home",
      soundEffects: "Sound Effects",
      new: "New",
      trending: "Trending",
      categories: "Categories",
      memeSoundboard: "Meme Soundboard",
      playRandom: "Play Random",
      addMoreFun: "More Fun",
      aiSoundButtons: "AI Sound Buttons",
      textToSound: "Text To Sound",
      leaderboard: "Leaderboard",
      createSound: "Create Sound",
      kidsSoundboard: "Kids Soundboard",
      searchPlaceholder: "Search Sound buttons...",
      joinFree: "Join Free",
      login: "Login",
      register: "Register",
      upload: "Upload",
      menu: "Menu",
      signedInAs: "Signed in as",
      myProfile: "My Profile",
      mySoundboard: "My Sounds Board",
      myFavorites: "Favorites",
      logout: "Logout",
    },
    footer: {
      whyChoose: "Why Choose SoundButtons.com?",
      specialPages: "Special Pages",
      categories: "Categories",
      support: "Support",
      contactInfo: "Contact Information",
      viewAllCategories: "View All Categories",
      home: "Home",
      soundButtonsUnblocked: "Sound Buttons Unblocked",
      soundButtonsForSchool: "Sound Buttons for School",
      soundboard: "Soundboard",
      textToSound: "Text To Sound",
      createSound: "Create Sound",
      playRandom: "Play Random Sound",
      newSoundButtons: "New Sound Buttons",
      trending: "Trending",
      userReviews: "User Reviews",
      games: "Games",
      kidsSoundboard: "Kids Soundboard",
      soundEffects: "Sound Effects",
      signIn: "Sign In",
      createAccount: "Create Account",
      aboutUs: "About Us",
      contactUs: "Contact Us",
      privacyPolicy: "Privacy Policy",
      termsOfUse: "Terms of Use",
      siteMap: "Site Map",
      downloadAppGoogle: "Download App From Google Play Store",
      downloadAppApple: "Download App from Apple App Store",
      whyChooseParagraph:
        "SoundButtons.com is a platform that allows you to create your own sound buttons from any device. It's a free platform that allows you to create your own sound buttons, meme soundboard, sound effects, and more from any device.",
    },
    home: {
      heroTitle: "Sound Buttons + Meme Soundboard: 100,000+ Unblocked Instant Play Effect Buttons",
      heroDescription:
        "Explore a huge collection of hilarious sound buttons, meme soundboard, sound effects, and unblocked soundboards all free! Create custom sound buttons from your smartphone, desktop, Chromebook, or tablet.",
      searchPlaceholder: "Search Sound buttons...",
      trendingTitle: "Trending Meme Soundboard",
      newTitle: "New Sound Buttons",
      viewAll: "View All",
      view: "View",
      loadMoreSounds: "Load More Sounds",
      aboutTitle: "About SoundButtons.com",
      autoPlay: "Auto Play",
      stopAuto: "Stop Auto",
      randomPlay: "Random Play",
      stopRandom: "Stop Random",
      autoShort: "Auto",
      stopShort: "Stop",
      randomShort: "Random",
    },
    search: {
      pageTitle: "Search Sound Buttons",
      noResults: "No sounds found. Try a different search.",
      loadMore: "Load more",
      resultsTitleTemplate: "{query} - Sound Buttons | SoundButtons.com",
      heroTitleTemplate: "{count} {query} Sound Buttons: Unblocked Meme Soundboard",
      heroDescriptionTemplate: "Found {count} sound buttons - free to play and download",
      searchMorePlaceholder: "Search for more... (e.g. meme, fart, game)",
      soundListTitleTemplate: "{query} Sound Buttons",
      loadingMore: "Loading more sounds...",
      scrollForMore: "Scroll down for more sounds",
      browseCategories: "Browse Categories",
      trendingSounds: "Trending Sounds",
      tryDifferentSearch: "Try searching with different keywords or browse our categories",
    },
    soundDetail: {
      youMightLike: "You Might Like",
      aboutThisSound: "About This Sound",
      howToUse: "How to Use This Sound",
      popularUses: "Popular Uses",
      exploreMoreSounds: "Explore More Sounds",
      moreCategorySounds: "More {category} Sounds",
      trending: "Trending",
      newSounds: "New Sounds",
      soundboard: "Soundboard",
      download: "Download",
      share: "Share",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
      playInstantly: "Play instantly:",
      downloadForFree: "Download for free:",
      useInContent: "Use in content:",
      shareWithFriends: "Share with friends:",
    },
    about: {
      aboutTitle: "About SoundButtons.com",
      authorCreator: "Author & Creator",
      whyStartedTitle: "Why I Started SoundButtons",
      contactInfoTitle: "Contact Information",
    },
    aboutContent: {
      mainTitle: "SoundButtons.com: Your Daily Dose of Sound Effects Chaos - The Ultimate Meme Soundboard 2026",
      tableOfContents: "Table of Contents",
      tocIntroduction: "Introduction",
      tocWhatAreSoundButtons: "What are Sound Buttons?",
      tocWhatYouGet: "What You're Actually Getting Here",
      tocQualitySounds: "Sounds That Don't Sound Like Trash",
      tocWorksEverywhere: "Works at School, Work, Wherever",
      tocEasyToUse: "Just Click and It Plays",
      tocOrganization: "How We've Organized This",
      tocMemeSoundboard: "Meme Soundboard",
      tocStreamers: "Perfect for Streamers and Creators",
      tocDiscord: "Perfect for Discord and Just Hanging Out",
      tocHowItWorks: "How This Actually Works",
      tocWhyExists: "Why This Site Exists",
      tocFaq: "Frequently Asked Questions",
      tocAboutContact: "About & Contact",
      welcomeBefore: "Welcome to SoundButtons.com! Whether you're searching for that perfect Vine boom for your Discord server or need a soundboard that actually works at school, you've found the right place. Thousands of people have made this their go-to spot for ",
      linkMemeSounds: "meme sounds",
      welcomeAfter: " and funny audio clips.",
      welcomeParagraph2:
        "We built this site because we got tired of soundboards that are blocked, full of garbage quality sounds, or so cluttered you can't find anything. So we fixed all that stuff.",
      whatAreSoundButtonsTitle: "What are Sound Buttons?",
      whatAreSoundButtonsPart1:
        "Sound buttons are interactive clickable buttons that play audio clips instantly when you click them - no downloads or installations needed. On SoundButtons.com, we offer the largest collection of free ",
      linkMemeSoundButtons: "meme sound buttons",
      whatAreSoundButtonsPart2: ", ",
      linkFunnySoundButtons: "funny sound buttons",
      whatAreSoundButtonsPart3: ", ",
      linkSoundEffects: "sound effects",
      whatAreSoundButtonsPart4: ", and ",
      linkTrendingSoundButtons: "trending sound buttons",
      whatAreSoundButtonsPart5: ". Our sound buttons work instantly in any browser on computers, phones, tablets, and even at school where other sites might be blocked. Perfect for ",
      linkContentCreators: "content creators",
      whatAreSoundButtonsPart6: ", streamers, students, and anyone who wants instant access to quality audio clips - all completely free with no registration required.",
      whatYouGetTitle: "What You're Actually Getting Here",
      whatYouGetPart1: "We've built up a massive collection of ",
      linkTrendingSoundButtons2: "trending sound buttons",
      whatYouGetPart2:
        " over the past couple years. Everything from classic meme soundboard clips to that weird sound effect you heard on TikTok last week. The whole thing works in your browser no downloads, ever.",
      qualitySoundsTitle: "Sounds That Don't Sound Like Trash",
      qualitySoundsPart1:
        "Every single sound is clean audio. We actually listen to stuff before adding it. If it sounds muffled or the levels are all over the place, it doesn't make the cut. We've got your standard ",
      linkMemeButtons: "meme buttons",
      qualitySoundsPart2:
        ", and we also dig through the internet constantly looking for new trending sounds. When something goes viral, we usually have it up within a few days.",
      worksEverywhereTitle: "Works at School, Work, Wherever",
      worksEverywherePart1:
        "This is probably the main reason most people stick around. Our site works on restricted networks. We spent a lot of time testing this on different networks because getting blocked is incredibly annoying. This is a proper ",
      linkSoundboardUnblocked: "soundboard unblocked",
      worksEverywherePart2: " that you can actually rely on.",
      easyToUseTitle: "Just Click and It Plays",
      easyToUseContent:
        'No signup forms. No email verification. No "watch this ad first" nonsense. You see a sound you want, you click it, it plays immediately. Want to use sounds on your phone? Works great. Tablet? Yep. Your ancient laptop from 2015? Probably fine.',
      organizationTitle: "How We've Organized This",
      organizationIntro: "With thousands of sounds, organization matters. Browse by category:",
      linkMemeSection: "The Meme Section",
      organizationMemeDesc: " — Every meme soundboard clip you've ever wanted",
      linkFunnyStuff: "Funny Stuff",
      organizationFunnyDesc: " — Designed for making your friends crack up",
      linkGamingSounds: "Gaming Sounds",
      organizationGamingDesc: " — Iconic sounds from popular games",
      linkMovieTvClips: "Movie and TV Clips",
      organizationMovieDesc: " — Famous quotes and dramatic moments",
      linkSoundEffects2: "Sound Effects",
      organizationEffectsDesc: " — Professional tones and effects for alerts",
      memeSoundboardTitle: "Meme Soundboard",
      memeSoundboardPart1:
        "Our ",
      linkMemeSoundboard: "meme soundboard",
      memeSoundboardPart2:
        " is the heart of SoundButtons.com. It's where every meme soundboard clip you've ever wanted lives. From classic Vine booms to the latest TikTok trends, our meme soundboard collection is constantly updated with the most viral sounds. Whether you're looking for reaction sounds, funny clips, or that perfect meme button for your Discord server, our ",
      linkMemeSoundboard2: "meme soundboard",
      memeSoundboardPart3: " has you covered.",
      memeSoundboardPart4:
        "What makes our meme soundboard special? Every sound is hand-picked for quality and relevance. We don't just dump random audio files we curate the best meme sounds that people actually want to use. When a new meme goes viral, we're usually one of the first to have it available on our meme soundboard. Plus, our meme soundboard works everywhere, even on restricted networks, making it the perfect unblocked meme soundboard for school, work, or anywhere else.",
      streamersTitle: "Perfect for Streamers and Creators",
      streamersPart1:
        "Every sound button here is broadcast quality. These are clean, properly leveled, well edited clips that won't make your stream sound amateur. We try to stay on top of trends, adding new ",
      linkMemeButtons2: "meme buttons",
      streamersPart2:
        " pretty much every week. Our search actually works well (use the search bar at the top), and you can save favorites for quick access.",
      discordTitle: "Perfect for Discord and Just Hanging Out",
      discordContent:
        "Playing sounds through Discord is super easy. You can trigger them through your mic or share links to specific sounds. Whether it's gaming with friends or just hanging out in voice chat, having instant access to thousands of funny sounds changes the vibe entirely.",
      howItWorksTitle: "How This Actually Works",
      howItWorksStep1Label: "Find what you want:",
      linkBrowseCategories: "browse categories",
      howItWorksStep1Rest: " or use the search bar above to find something specific.",
      howItWorksStep2Label: "Click it:",
      howItWorksStep2Rest: " The sound plays immediately. No loading, no buffering, no annoying delays.",
      howItWorksStep3Label: "Save the good ones:",
      howItWorksStep3Rest: " Click the heart icon on sounds you love and they get saved to your favorites.",
      whyExistsTitle: "Why This Site Exists",
      whyExistsParagraph1:
        "Most soundboard sites are either blocked everywhere or they're full of random garbage people uploaded. We wanted something different. Something that actually worked reliably and only had genuinely good sounds. We're not exaggerating about the unblocked thing we've tested this on school networks, corporate WiFi, public library computers, everywhere we could think of.",
      whyExistsParagraph2:
        "We don't let anyone upload anything. Every single sound gets checked by our team first. Is the audio clean? Is it something people would actually use? Does it fit our collection? If the answer to any of those is no, it doesn't go up. This keeps the quality consistent and the library actually useful instead of cluttered.",
      faqTitle: "Frequently Asked Questions",
      faq1Question: "Is this actually free?",
      faq1Answer:
        "It's genuinely free. No hidden costs, no subscriptions, no premium version. Everything you see is available to everyone.",
      faq2Question: "Does this really work at school?",
      faq2Answer:
        "For most people, yes. We've had thousands of students tell us it works on their school networks. Obviously we can't guarantee every single school because some have really extreme filtering, but it works on the vast majority of restricted networks.",
      faq3Question: "Can I use these for YouTube videos?",
      faq3Answer:
        "Yes, people do all the time. Most of these are meme sounds or public domain stuff that's fine to use in content. If you're planning to monetize videos, you might want to be slightly careful with certain movie or TV clips, but generally speaking these are meant to be used in content.",
      faq4Question: "Is there a limit to how many sounds I can play?",
      faq4Answer:
        "No. Click away. Play the same sound 500 times if that's your thing. We don't limit usage because that would be silly.",
      founderLabel: "Siya P — Founder & Creator of SoundButtons.com",
      whyStartedP1:
        "I created SoundButtons.com with a simple mission: to provide free, high-quality sound buttons that are accessible to everyone, especially kids, creators, streamers, and students. Growing up, I noticed that most soundboard websites were either blocked at school, required downloads, or had poor-quality audio. This frustrated me and many others who just wanted to have fun with sounds.",
      whyStartedP2:
        "I wanted to build something different - a platform where kids could safely explore funny sounds and meme buttons without worrying about restrictions. A place where content creators and streamers could find broadcast-quality sound effects instantly. A resource that students could use for school projects or just for fun during breaks, without getting blocked by network filters.",
      whyStartedP3:
        "SoundButtons.com is my way of giving back to the community. Every sound is hand-curated for quality, every feature is designed with the user in mind, and everything is completely free. No hidden costs, no premium tiers, no nonsense. Just quality sound buttons that work when and where you need them.",
      whyStartedP4:
        "Whether you're a kid looking for funny sounds, a creator needing sound effects for your videos, a streamer wanting to enhance your broadcasts, or just someone who enjoys meme sounds - SoundButtons.com is here for you. This is more than just a website; it's a tool for creativity, entertainment, and fun.",
      emailLabel: "Email:",
      phoneLabel: "Phone:",
      addressLabel: "Address:",
      addressValue: "2847 Digital Avenue, Suite 102, San Francisco, CA 94105, United States",
      finalPart1:
        "SoundButtons isn't trying to be some revolutionary platform. It's just a solid, reliable place to find quality sound effects that works everywhere and doesn't waste your time. No gimmicks, no nonsense, just sounds that work when you need them. ",
      linkCheckOutCollection: "Check out the collection",
      finalPart2: "—it's free and takes like 10 seconds.",
      readIn: "Read in:",
      langEn: "English",
      langEs: "Español",
      langPt: "Português",
      langFr: "Français",
    },
    category: {
      categories: "Categories",
      subcategories: "Subcategories",
      exploreMore: "Explore more with our",
      newSounds: "new sounds",
      trending: "trending sounds",
      allCategories: "all categories",
    },
    common: {
      loadMore: "Load more",
      viewAll: "View all",
      loading: "Loading...",
      noSoundsFound: "No sounds found",
    },
    aiSoundButtons: {
      heroTitle: "AI Sound Buttons",
      heroDescription: "Ask for a category or describe what you want — play sounds instantly.",
      quickQuestionsLabel: "Quick picks",
      inputPlaceholder: "e.g. meme sounds, funny fart, dog barks...",
      ask: "Ask",
      sending: "Sending...",
      thinking: "Thinking...",
      noMatch: "No category matched. Try a quick pick below or type something like \"funny memes\".",
      noSoundsInCategory: "No sounds found for this.",
      errorMessage: "Something went wrong. Please try again.",
      showMore: "Show more",
      showingXOfY: "Showing {shown} of {total}",
      soundButtonsLabel: "Sound Buttons",
      welcomeTitle: "Welcome to AI Sound Buttons",
      welcomeSubtitle: "Click a quick pick or type what you want to hear.",
      tryCategoryBelow: "Try a category below or type your own.",
      hereAreCategory: "Here are some {name} sound buttons:",
      hereAreSearch: "Here are sounds for \"{query}\":",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      soundEffects: "Efectos de Sonido",
      new: "Nuevo",
      trending: "Tendencia",
      categories: "Categorías",
      memeSoundboard: "Soundboard de Memes",
      playRandom: "Reproducir Aleatorio",
      addMoreFun: "Más Diversión",
      aiSoundButtons: "Botones de Sonido IA",
      textToSound: "Texto a Sonido",
      leaderboard: "Clasificación",
      createSound: "Crear Sonido",
      kidsSoundboard: "Soundboard para Niños",
      searchPlaceholder: "Buscar",
      joinFree: "Unirse Gratis",
      login: "Iniciar Sesión",
      register: "Registrarse",
      upload: "Subir",
      menu: "Menú",
      signedInAs: "Conectado como",
      myProfile: "Mi Perfil",
      mySoundboard: "Mi Soundboard",
      myFavorites: "Favoritos",
      logout: "Cerrar Sesión",
    },
    footer: {
      whyChoose: "¿Por qué elegir SoundButtons.com?",
      specialPages: "Páginas Especiales",
      categories: "Categorías",
      support: "Soporte",
      contactInfo: "Información de Contacto",
      viewAllCategories: "Ver Todas las Categorías",
      home: "Inicio",
      soundButtonsUnblocked: "Sound Buttons Desbloqueados",
      soundButtonsForSchool: "Sound Buttons para la Escuela",
      soundboard: "Soundboard",
      textToSound: "Texto a Sonido",
      createSound: "Crear Sonido",
      playRandom: "Reproducir Sonido Aleatorio",
      newSoundButtons: "Nuevos Sound Buttons",
      trending: "Tendencia",
      userReviews: "Reseñas de Usuarios",
      games: "Juegos",
      kidsSoundboard: "Soundboard para Niños",
      soundEffects: "Efectos de Sonido",
      signIn: "Iniciar Sesión",
      createAccount: "Crear Cuenta",
      aboutUs: "Sobre Nosotros",
      contactUs: "Contacto",
      privacyPolicy: "Política de Privacidad",
      termsOfUse: "Términos de Uso",
      siteMap: "Mapa del Sitio",
      downloadAppGoogle: "Descargar App en Google Play",
      downloadAppApple: "Descargar App en App Store",
      whyChooseParagraph:
        "SoundButtons.com es una plataforma que te permite crear tus propios botones de sonido desde cualquier dispositivo. Es gratis y puedes crear soundboard de memes, efectos de sonido y más.",
    },
    home: {
      heroTitle: "Botones de Sonido y Soundboard de Memes: Más de 100,000 Botones de Memes Desbloqueados",
      heroDescription:
        "Explora una enorme colección de botones de sonido divertidos, soundboard de memes, efectos sonoros y soundboards desbloqueados, ¡todo gratis! Crea botones de sonido personalizados desde tu smartphone, computadora, Chromebook o tablet.",
      searchPlaceholder: "Buscar",
      trendingTitle: "Botones de Sonido: En Tendencia",
      newTitle: "Botones de Sonido: Nuevo Soundboard",
      viewAll: "Ver Todo",
      view: "Ver",
      loadMoreSounds: "Cargar más sonidos",
      aboutTitle: "Acerca de SoundButtons.com",
      autoPlay: "Reproducción automática",
      stopAuto: "Detener auto",
      randomPlay: "Reproducción aleatoria",
      stopRandom: "Detener aleatorio",
      autoShort: "Auto",
      stopShort: "Detener",
      randomShort: "Aleatorio",
    },
    search: {
      pageTitle: "Buscar Sound Buttons",
      noResults: "No se encontraron sonidos. Prueba otra búsqueda.",
      loadMore: "Cargar más",
      resultsTitleTemplate: "{query} - Botones de Sonido | SoundButtons.com",
      heroTitleTemplate: "{count} botones de sonido {query}",
      heroDescriptionTemplate: "Encontrados {count} botones de sonido - gratis para reproducir y descargar",
      searchMorePlaceholder: "Buscar más... (ej. meme, fart, game)",
      soundListTitleTemplate: "{query} botones de sonido",
      loadingMore: "Cargando más sonidos...",
      scrollForMore: "Desplázate para ver más sonidos",
      browseCategories: "Ver categorías",
      trendingSounds: "Sonidos en tendencia",
      tryDifferentSearch: "Prueba con otras palabras o explora nuestras categorías",
    },
    soundDetail: {
      youMightLike: "También te puede gustar",
      aboutThisSound: "Acerca de este sonido",
      howToUse: "Cómo usar este sonido",
      popularUses: "Usos populares",
      exploreMoreSounds: "Explorar más sonidos",
      moreCategorySounds: "Más sonidos de {category}",
      trending: "Tendencia",
      newSounds: "Nuevos sonidos",
      soundboard: "Soundboard",
      download: "Descargar",
      share: "Compartir",
      addToFavorites: "Añadir a favoritos",
      removeFromFavorites: "Quitar de favoritos",
      playInstantly: "Reproducir al instante:",
      downloadForFree: "Descargar gratis:",
      useInContent: "Usar en contenido:",
      shareWithFriends: "Compartir con amigos:",
    },
    about: {
      aboutTitle: "Acerca de SoundButtons.com",
      authorCreator: "Autor y Creador",
      whyStartedTitle: "Por qué creé SoundButtons",
      contactInfoTitle: "Información de contacto",
    },
    aboutContent: {
      mainTitle: "SoundButtons.com: Tu Dosis Diaria de Caos en Efectos de Sonido - La Mesa de Sonido de Memes Definitiva 2026",
      tableOfContents: "Tabla de contenidos",
      tocIntroduction: "Introducción",
      tocWhatAreSoundButtons: "¿Qué son los Botones de Sonido?",
      tocWhatYouGet: "Qué Obtienes Aquí en Realidad",
      tocQualitySounds: "Sonidos que No Suenan a Basura",
      tocWorksEverywhere: "Funciona en la Escuela, Trabajo, Donde Sea",
      tocEasyToUse: "Solo Haz Clic y Se Reproduce",
      tocOrganization: "Cómo Hemos Organizado Esto",
      tocMemeSoundboard: "Soundboard de Memes",
      tocStreamers: "Perfecto para Streamers y Creadores",
      tocDiscord: "Perfecto para Discord y Pasar el Rato",
      tocHowItWorks: "Cómo Funciona Esto en Realidad",
      tocWhyExists: "Por Qué Existe Este Sitio",
      tocFaq: "Preguntas Frecuentes",
      tocAboutContact: "Acerca y Contacto",
      welcomeBefore:
        "¡Bienvenido a SoundButtons.com! Ya sea que busques ese Vine boom perfecto para tu servidor de Discord o necesites un soundboard que funcione en la escuela, has encontrado el lugar correcto. Miles de personas han hecho de este su lugar favorito para ",
      linkMemeSounds: "sonidos de memes",
      welcomeAfter: " y clips de audio divertidos.",
      welcomeParagraph2:
        "Construimos este sitio porque nos cansamos de soundboards bloqueados, llenos de sonidos de mala calidad o tan desordenados que no encuentras nada. Así que arreglamos todo eso.",
      whatAreSoundButtonsTitle: "¿Qué son los Botones de Sonido?",
      whatAreSoundButtonsPart1:
        "Los botones de sonido son botones interactivos en los que haces clic y reproducen clips de audio al instante - sin descargas ni instalaciones. En SoundButtons.com ofrecemos la mayor colección gratuita de ",
      linkMemeSoundButtons: "botones de sonido de memes",
      whatAreSoundButtonsPart2: ", ",
      linkFunnySoundButtons: "botones de sonido divertidos",
      whatAreSoundButtonsPart3: ", ",
      linkSoundEffects: "efectos de sonido",
      whatAreSoundButtonsPart4: " y ",
      linkTrendingSoundButtons: "botones de sonido en tendencia",
      whatAreSoundButtonsPart5:
        ". Nuestros botones de sonido funcionan al instante en cualquier navegador en ordenadores, móviles, tablets, e incluso en la escuela donde otros sitios pueden estar bloqueados. Perfecto para ",
      linkContentCreators: "creadores de contenido",
      whatAreSoundButtonsPart6:
        ", streamers, estudiantes y cualquiera que quiera acceso instantáneo a clips de audio de calidad - todo completamente gratis sin registro.",
      whatYouGetTitle: "Qué Obtienes Aquí en Realidad",
      whatYouGetPart1: "Hemos creado una colección masiva de ",
      linkTrendingSoundButtons2: "botones de sonido en tendencia",
      whatYouGetPart2:
        " en los últimos años. Desde clips clásicos de soundboard de memes hasta ese efecto de sonido raro que escuchaste en TikTok la semana pasada. Todo funciona en tu navegador, sin descargas, nunca.",
      qualitySoundsTitle: "Sonidos que No Suenan a Basura",
      qualitySoundsPart1:
        "Cada sonido es audio limpio. Realmente escuchamos todo antes de añadirlo. Si suena apagado o los niveles están descontrolados, no pasa el corte. Tenemos tus ",
      linkMemeButtons: "botones de memes",
      qualitySoundsPart2:
        " estándar, y también buscamos constantemente en internet nuevos sonidos en tendencia. Cuando algo se hace viral, normalmente lo tenemos disponible en unos días.",
      worksEverywhereTitle: "Funciona en la Escuela, Trabajo, Donde Sea",
      worksEverywherePart1:
        "Esta es probablemente la razón principal por la que la gente se queda. Nuestro sitio funciona en redes restringidas. Pasamos mucho tiempo probando esto en diferentes redes porque ser bloqueado es increíblemente molesto. Este es un ",
      linkSoundboardUnblocked: "soundboard desbloqueado",
      worksEverywherePart2: " en el que realmente puedes confiar.",
      easyToUseTitle: "Solo Haz Clic y Se Reproduce",
      easyToUseContent:
        'Sin formularios de registro. Sin verificación de email. Sin la tontería de "mira este anuncio primero". Ves un sonido que quieres, haces clic y se reproduce inmediatamente. ¿Quieres usar sonidos en tu móvil? Funciona genial. ¿Tablet? Sí. ¿Tu portátil antiguo de 2015? Probablemente bien.',
      organizationTitle: "Cómo Hemos Organizado Esto",
      organizationIntro: "Con miles de sonidos, la organización importa. Navega por categoría:",
      linkMemeSection: "La Sección de Memes",
      organizationMemeDesc: " — Cada clip de soundboard de memes que siempre quisiste",
      linkFunnyStuff: "Cosas Divertidas",
      organizationFunnyDesc: " — Diseñado para hacer reír a tus amigos",
      linkGamingSounds: "Sonidos de Juegos",
      organizationGamingDesc: " — Sonidos icónicos de juegos populares",
      linkMovieTvClips: "Clips de Películas y TV",
      organizationMovieDesc: " — Citas famosas y momentos dramáticos",
      linkSoundEffects2: "Efectos de Sonido",
      organizationEffectsDesc: " — Tonos y efectos profesionales para alertas",
      memeSoundboardTitle: "Soundboard de Memes",
      memeSoundboardPart1: "Nuestro ",
      linkMemeSoundboard: "soundboard de memes",
      memeSoundboardPart2:
        " es el corazón de SoundButtons.com. Es donde vive cada clip de soundboard de memes que siempre quisiste. Desde los Vine boom clásicos hasta las últimas tendencias de TikTok, nuestra colección de soundboard de memes se actualiza constantemente con los sonidos más virales. Ya sea que busques sonidos de reacción, clips divertidos o ese botón de meme perfecto para tu servidor de Discord, nuestro ",
      linkMemeSoundboard2: "soundboard de memes",
      memeSoundboardPart3: " te tiene cubierto.",
      memeSoundboardPart4:
        "¿Qué hace especial a nuestro soundboard de memes? Cada sonido está seleccionado manualmente por calidad y relevancia. No solo tiramos archivos de audio aleatorios: curamos los mejores sonidos de memes que la gente realmente quiere usar. Cuando un nuevo meme se hace viral, normalmente somos de los primeros en tenerlo disponible en nuestro soundboard de memes. Además, nuestro soundboard de memes funciona en todas partes, incluso en redes restringidas, haciéndolo el soundboard de memes desbloqueado perfecto para la escuela, trabajo o donde sea.",
      streamersTitle: "Perfecto para Streamers y Creadores",
      streamersPart1:
        "Cada botón de sonido aquí es de calidad de transmisión. Son clips limpios, con niveles correctos y bien editados que no harán que tu stream suene amateur. Intentamos estar al día con las tendencias, añadiendo nuevos ",
      linkMemeButtons2: "botones de memes",
      streamersPart2:
        " prácticamente cada semana. Nuestra búsqueda funciona bien (usa la barra de búsqueda arriba), y puedes guardar favoritos para acceso rápido.",
      discordTitle: "Perfecto para Discord y Pasar el Rato",
      discordContent:
        "Reproducir sonidos a través de Discord es súper fácil. Puedes activarlos a través de tu micrófono o compartir enlaces a sonidos específicos. Ya sea jugando con amigos o simplemente pasando el rato en chat de voz, tener acceso instantáneo a miles de sonidos divertidos cambia completamente el ambiente.",
      howItWorksTitle: "Cómo Funciona Esto en Realidad",
      howItWorksStep1Label: "Encuentra lo que quieres:",
      linkBrowseCategories: "navega por categorías",
      howItWorksStep1Rest: " o usa la barra de búsqueda de arriba para encontrar algo específico.",
      howItWorksStep2Label: "Haz clic:",
      howItWorksStep2Rest: " El sonido se reproduce inmediatamente. Sin cargas, sin buffering, sin retrasos molestos.",
      howItWorksStep3Label: "Guarda los buenos:",
      howItWorksStep3Rest: " Haz clic en el icono del corazón en los sonidos que te encantan y se guardan en tus favoritos.",
      whyExistsTitle: "Por Qué Existe Este Sitio",
      whyExistsParagraph1:
        "La mayoría de sitios de soundboard están bloqueados en todas partes o están llenos de basura aleatoria que la gente subió. Queríamos algo diferente. Algo que funcionara de forma fiable y solo tuviera sonidos genuinamente buenos. No exageramos lo del desbloqueado: lo hemos probado en redes escolares, WiFi corporativo, ordenadores de bibliotecas públicas, en todos los lugares que se nos ocurrieron.",
      whyExistsParagraph2:
        "No dejamos que nadie suba nada. Cada sonido es revisado primero por nuestro equipo. ¿El audio está limpio? ¿Es algo que la gente realmente usaría? ¿Encaja en nuestra colección? Si la respuesta a cualquiera de esas es no, no se sube. Esto mantiene la calidad consistente y la biblioteca realmente útil en lugar de desordenada.",
      faqTitle: "Preguntas Frecuentes",
      faq1Question: "¿Es realmente gratis?",
      faq1Answer:
        "Es genuinamente gratis. Sin costes ocultos, sin suscripciones, sin versión premium. Todo lo que ves está disponible para todos.",
      faq2Question: "¿Realmente funciona en la escuela?",
      faq2Answer:
        "Para la mayoría de la gente, sí. Miles de estudiantes nos han dicho que funciona en sus redes escolares. Obviamente no podemos garantizar cada escuela porque algunas tienen filtros realmente extremos, pero funciona en la gran mayoría de redes restringidas.",
      faq3Question: "¿Puedo usar estos para videos de YouTube?",
      faq3Answer:
        "Sí, la gente lo hace todo el tiempo. La mayoría son sonidos de memes o material de dominio público que está bien usar en contenido. Si planeas monetizar videos, quizá quieras tener cuidado con ciertos clips de películas o TV, pero en general están pensados para usarse en contenido.",
      faq4Question: "¿Hay límite de cuántos sonidos puedo reproducir?",
      faq4Answer: "No. Haz clic todo lo que quieras. Reproduce el mismo sonido 500 veces si es lo tuyo. No limitamos el uso porque sería ridículo.",
      founderLabel: "Siya P — Fundador y Creador de SoundButtons.com",
      whyStartedP1:
        "Creé SoundButtons.com con una misión simple: proporcionar botones de sonido gratuitos y de alta calidad accesibles para todos, especialmente niños, creadores, streamers y estudiantes. Al crecer, noté que la mayoría de sitios de soundboard estaban bloqueados en la escuela, requerían descargas o tenían audio de mala calidad. Esto me frustraba a mí y a muchos otros que solo querían divertirse con sonidos.",
      whyStartedP2:
        "Quería construir algo diferente: una plataforma donde los niños pudieran explorar de forma segura sonidos divertidos y botones de memes sin preocuparse por restricciones. Un lugar donde creadores y streamers pudieran encontrar efectos de sonido de calidad de transmisión al instante. Un recurso que los estudiantes pudieran usar para proyectos escolares o solo por diversión en los descansos, sin ser bloqueados por filtros de red.",
      whyStartedP3:
        "SoundButtons.com es mi forma de devolver a la comunidad. Cada sonido está curado manualmente por calidad, cada función está diseñada pensando en el usuario, y todo es completamente gratis. Sin costes ocultos, sin niveles premium, sin tonterías. Solo botones de sonido de calidad que funcionan cuando y donde los necesitas.",
      whyStartedP4:
        "Ya sea que seas un niño buscando sonidos divertidos, un creador que necesita efectos de sonido para tus videos, un streamer que quiere mejorar sus transmisiones o alguien que disfruta los sonidos de memes - SoundButtons.com está aquí para ti. Esto es más que un sitio web; es una herramienta para creatividad, entretenimiento y diversión.",
      emailLabel: "Email:",
      phoneLabel: "Teléfono:",
      addressLabel: "Dirección:",
      addressValue: "2847 Digital Avenue, Suite 102, San Francisco, CA 94105, United States",
      finalPart1:
        "SoundButtons no intenta ser una plataforma revolucionaria. Es solo un lugar sólido y fiable para encontrar efectos de sonido de calidad que funciona en todas partes y no pierde tu tiempo. Sin trucos, sin tonterías, solo sonidos que funcionan cuando los necesitas. ",
      linkCheckOutCollection: "Echa un vistazo a la colección",
      finalPart2: "—es gratis y toma como 10 segundos.",
      readIn: "Leer en:",
      langEn: "English",
      langEs: "Español",
      langPt: "Português",
      langFr: "Français",
    },
    category: {
      categories: "Categorías",
      subcategories: "Subcategorías",
      exploreMore: "Explora más con nuestros",
      newSounds: "nuevos sonidos",
      trending: "sonidos en tendencia",
      allCategories: "todas las categorías",
    },
    common: {
      loadMore: "Cargar más",
      viewAll: "Ver todo",
      loading: "Cargando...",
      noSoundsFound: "No se encontraron sonidos",
    },
    aiSoundButtons: {
      heroTitle: "Botones de Sonido IA",
      heroDescription: "Pide una categoría o describe lo que quieres — reproduce sonidos al instante.",
      quickQuestionsLabel: "Opciones rápidas",
      inputPlaceholder: "ej. memes, sonidos de perro, risa...",
      ask: "Preguntar",
      sending: "Enviando...",
      thinking: "Pensando...",
      noMatch: "No hay categoría. Prueba una opción rápida o escribe algo como \"memes graciosos\".",
      noSoundsInCategory: "No se encontraron sonidos.",
      errorMessage: "Algo salió mal. Intenta de nuevo.",
      showMore: "Ver más",
      showingXOfY: "Mostrando {shown} de {total}",
      soundButtonsLabel: "Botones de Sonido",
      welcomeTitle: "Bienvenido a Botones de Sonido IA",
      welcomeSubtitle: "Elige una opción rápida o escribe lo que quieres escuchar.",
      tryCategoryBelow: "Prueba una categoría abajo o escribe lo que quieras.",
      hereAreCategory: "Aquí tienes botones de sonido de {name}:",
      hereAreSearch: "Aquí tienes sonidos para \"{query}\":",
    },
  },
  pt: {
    nav: {
      home: "Início",
      soundEffects: "Efeitos Sonoros",
      new: "Novo",
      trending: "Em Alta",
      categories: "Categorias",
      memeSoundboard: "Mesa de Som de Memes",
      playRandom: "Reproduzir Aleatório",
      addMoreFun: "Mais Diversão",
      aiSoundButtons: "Botões de Som IA",
      textToSound: "Texto para Som",
      leaderboard: "Classificação",
      createSound: "Criar Som",
      kidsSoundboard: "Soundboard para Crianças",
      searchPlaceholder: "Pesquisar",
      joinFree: "Cadastre-se Grátis",
      login: "Entrar",
      register: "Cadastrar",
      upload: "Enviar",
      menu: "Menu",
      signedInAs: "Conectado como",
      myProfile: "Meu Perfil",
      mySoundboard: "Meu Soundboard",
      myFavorites: "Favoritos",
      logout: "Sair",
    },
    footer: {
      whyChoose: "Por que escolher SoundButtons.com?",
      specialPages: "Páginas Especiais",
      categories: "Categorias",
      support: "Suporte",
      contactInfo: "Informações de Contato",
      viewAllCategories: "Ver Todas as Categorias",
      home: "Início",
      soundButtonsUnblocked: "Sound Buttons Desbloqueados",
      soundButtonsForSchool: "Sound Buttons para Escola",
      soundboard: "Soundboard",
      textToSound: "Texto para Som",
      createSound: "Criar Som",
      playRandom: "Reproduzir Som Aleatório",
      newSoundButtons: "Novos Sound Buttons",
      trending: "Em Alta",
      userReviews: "Avaliações",
      games: "Jogos",
      kidsSoundboard: "Soundboard para Crianças",
      soundEffects: "Efeitos Sonoros",
      signIn: "Entrar",
      createAccount: "Criar Conta",
      aboutUs: "Sobre Nós",
      contactUs: "Contato",
      privacyPolicy: "Política de Privacidade",
      termsOfUse: "Termos de Uso",
      siteMap: "Mapa do Site",
      downloadAppGoogle: "Baixar App na Google Play",
      downloadAppApple: "Baixar App na App Store",
      whyChooseParagraph:
        "SoundButtons.com é uma plataforma que permite criar seus próprios botões de som em qualquer dispositivo. É grátis para criar soundboard de memes, efeitos sonoros e mais.",
    },
    home: {
      heroTitle: "Botões de som com mesa de som de memes: Mais de 100.000 botões de memes",
      heroDescription:
        "Explore uma enorme coleção de botões de som hilários, mesas de som de memes, efeitos sonoros, tudo grátis! Crie botões de som personalizados no seu smartphone, computador, Chromebook ou tablet.",
      searchPlaceholder: "Pesquisar",
      trendingTitle: "Botões de Som: Em Alta",
      newTitle: "Botões de Som: Novo Soundboard",
      viewAll: "Ver Tudo",
      view: "Ver",
      loadMoreSounds: "Carregar mais sons",
      aboutTitle: "Sobre o SoundButtons.com",
      autoPlay: "Reprodução automática",
      stopAuto: "Parar auto",
      randomPlay: "Reprodução aleatória",
      stopRandom: "Parar aleatório",
      autoShort: "Auto",
      stopShort: "Parar",
      randomShort: "Aleatório",
    },
    search: {
      pageTitle: "Pesquisar Sound Buttons",
      noResults: "Nenhum som encontrado. Tente outra pesquisa.",
      loadMore: "Carregar mais",
      resultsTitleTemplate: "{query} - Botões de Som | SoundButtons.com",
      heroTitleTemplate: "{count} botões de som {query}",
      heroDescriptionTemplate: "Encontrados {count} botões de som - grátis para reproduzir e baixar",
      searchMorePlaceholder: "Pesquisar mais... (ex. meme, fart, game)",
      soundListTitleTemplate: "{query} botões de som",
      loadingMore: "Carregando mais sons...",
      scrollForMore: "Role para ver mais sons",
      browseCategories: "Ver categorias",
      trendingSounds: "Sons em alta",
      tryDifferentSearch: "Tente outras palavras ou explore nossas categorias",
    },
    soundDetail: {
      youMightLike: "Você também pode gostar",
      aboutThisSound: "Sobre este som",
      howToUse: "Como usar este som",
      popularUses: "Usos populares",
      exploreMoreSounds: "Explorar mais sons",
      moreCategorySounds: "Mais sons de {category}",
      trending: "Em Alta",
      newSounds: "Novos sons",
      soundboard: "Soundboard",
      download: "Baixar",
      share: "Compartilhar",
      addToFavorites: "Adicionar aos favoritos",
      removeFromFavorites: "Remover dos favoritos",
      playInstantly: "Reproduzir instantaneamente:",
      downloadForFree: "Baixar grátis:",
      useInContent: "Usar em conteúdo:",
      shareWithFriends: "Compartilhar com amigos:",
    },
    about: {
      aboutTitle: "Sobre o SoundButtons.com",
      authorCreator: "Autor e Criador",
      whyStartedTitle: "Por que criei o SoundButtons",
      contactInfoTitle: "Informações de contato",
    },
    aboutContent: {
      mainTitle: "SoundButtons.com: Sua Dose Diária de Caos em Efeitos Sonoros - A Mesa de Som de Memes Definitiva 2026",
      tableOfContents: "Índice",
      tocIntroduction: "Introdução",
      tocWhatAreSoundButtons: "O que são Botões de Som?",
      tocWhatYouGet: "O que Você Realmente Obtém Aqui",
      tocQualitySounds: "Sons que Não Parecem Lixo",
      tocWorksEverywhere: "Funciona na Escola, Trabalho, Onde Quiser",
      tocEasyToUse: "É Só Clicar e Toca",
      tocOrganization: "Como Organizamos Isso",
      tocMemeSoundboard: "Mesa de Som de Memes",
      tocStreamers: "Perfeito para Streamers e Criadores",
      tocDiscord: "Perfeito para Discord e Só Relaxar",
      tocHowItWorks: "Como Isso Realmente Funciona",
      tocWhyExists: "Por Que Este Site Existe",
      tocFaq: "Perguntas Frequentes",
      tocAboutContact: "Sobre e Contato",
      welcomeBefore:
        "Bem-vindo ao SoundButtons.com! Seja você procurando aquele Vine boom perfeito para seu servidor Discord ou precise de uma mesa de som que funcione na escola, você encontrou o lugar certo. Milhares de pessoas tornaram este seu lugar preferido para ",
      linkMemeSounds: "sons de memes",
      welcomeAfter: " e clipes de áudio divertidos.",
      welcomeParagraph2:
        "Construímos este site porque nos cansamos de mesas de som bloqueadas, cheias de sons de má qualidade ou tão bagunçadas que não se acha nada. Então corrigimos tudo isso.",
      whatAreSoundButtonsTitle: "O que são Botões de Som?",
      whatAreSoundButtonsPart1:
        "Botões de som são botões interativos clicáveis que reproduzem clipes de áudio instantaneamente quando você clica - sem downloads ou instalações. No SoundButtons.com oferecemos a maior coleção gratuita de ",
      linkMemeSoundButtons: "botões de som de memes",
      whatAreSoundButtonsPart2: ", ",
      linkFunnySoundButtons: "botões de som divertidos",
      whatAreSoundButtonsPart3: ", ",
      linkSoundEffects: "efeitos sonoros",
      whatAreSoundButtonsPart4: " e ",
      linkTrendingSoundButtons: "botões de som em alta",
      whatAreSoundButtonsPart5:
        ". Nossos botões de som funcionam instantaneamente em qualquer navegador em computadores, celulares, tablets, e até na escola onde outros sites podem estar bloqueados. Perfeito para ",
      linkContentCreators: "criadores de conteúdo",
      whatAreSoundButtonsPart6:
        ", streamers, estudantes e qualquer um que queira acesso instantâneo a clipes de áudio de qualidade - tudo completamente grátis sem registro.",
      whatYouGetTitle: "O que Você Realmente Obtém Aqui",
      whatYouGetPart1: "Construímos uma coleção massiva de ",
      linkTrendingSoundButtons2: "botões de som em alta",
      whatYouGetPart2:
        " nos últimos anos. De clipes clássicos de mesa de som de memes àquele efeito sonoro estranho que você ouviu no TikTok na semana passada. Tudo funciona no seu navegador, sem downloads, nunca.",
      qualitySoundsTitle: "Sons que Não Parecem Lixo",
      qualitySoundsPart1:
        "Cada som é áudio limpo. Na verdade ouvimos tudo antes de adicionar. Se soa abafado ou os níveis estão uma bagunça, não passa. Temos seus ",
      linkMemeButtons: "botões de memes",
      qualitySoundsPart2:
        " padrão, e também fuçamos na internet constantemente procurando novos sons em alta. Quando algo viraliza, geralmente temos em poucos dias.",
      worksEverywhereTitle: "Funciona na Escola, Trabalho, Onde Quiser",
      worksEverywherePart1:
        "Esta é provavelmente a razão principal pela qual as pessoas ficam. Nosso site funciona em redes restritas. Passamos muito tempo testando em diferentes redes porque ser bloqueado é incrivelmente chato. Este é um ",
      linkSoundboardUnblocked: "soundboard desbloqueado",
      worksEverywherePart2: " em que você pode realmente confiar.",
      easyToUseTitle: "É Só Clicar e Toca",
      easyToUseContent:
        'Sem formulários de cadastro. Sem verificação de email. Sem besteira de "assista este anúncio primeiro". Você vê um som que quer, clica e toca imediatamente. Quer usar sons no celular? Funciona ótimo. Tablet? Sim. Seu laptop antigo de 2015? Provavelmente ok.',
      organizationTitle: "Como Organizamos Isso",
      organizationIntro: "Com milhares de sons, organização importa. Navegue por categoria:",
      linkMemeSection: "A Seção de Memes",
      organizationMemeDesc: " — Cada clipe de mesa de som de memes que você sempre quis",
      linkFunnyStuff: "Coisas Divertidas",
      organizationFunnyDesc: " — Feito para fazer seus amigos morrerem de rir",
      linkGamingSounds: "Sons de Jogos",
      organizationGamingDesc: " — Sons icônicos de jogos populares",
      linkMovieTvClips: "Clipes de Filmes e TV",
      organizationMovieDesc: " — Citações famosas e momentos dramáticos",
      linkSoundEffects2: "Efeitos Sonoros",
      organizationEffectsDesc: " — Tons e efeitos profissionais para alertas",
      memeSoundboardTitle: "Mesa de Som de Memes",
      memeSoundboardPart1: "Nossa ",
      linkMemeSoundboard: "mesa de som de memes",
      memeSoundboardPart2:
        " é o coração do SoundButtons.com. É onde vive cada clipe de mesa de som de memes que você sempre quis. Dos Vine boom clássicos às últimas tendências do TikTok, nossa coleção de mesa de som de memes é constantemente atualizada com os sons mais virais. Seja procurando sons de reação, clipes divertidos ou aquele botão de meme perfeito para seu servidor Discord, nossa ",
      linkMemeSoundboard2: "mesa de som de memes",
      memeSoundboardPart3: " tem você coberto.",
      memeSoundboardPart4:
        "O que torna nossa mesa de som de memes especial? Cada som é escolhido à mão por qualidade e relevância. Não jogamos arquivos de áudio aleatórios - curamos os melhores sons de memes que as pessoas realmente querem usar. Quando um novo meme viraliza, geralmente somos dos primeiros a ter disponível em nossa mesa de som de memes. Além disso, nossa mesa de som de memes funciona em todo lugar, mesmo em redes restritas, sendo a mesa de som de memes desbloqueada perfeita para escola, trabalho ou onde for.",
      streamersTitle: "Perfeito para Streamers e Criadores",
      streamersPart1:
        "Cada botão de som aqui é de qualidade de transmissão. São clipes limpos, com níveis corretos e bem editados que não vão deixar seu stream parecer amador. Tentamos acompanhar tendências, adicionando novos ",
      linkMemeButtons2: "botões de memes",
      streamersPart2:
        " praticamente toda semana. Nossa busca funciona bem (use a barra de busca no topo), e você pode salvar favoritos para acesso rápido.",
      discordTitle: "Perfeito para Discord e Só Relaxar",
      discordContent:
        "Tocar sons pelo Discord é super fácil. Você pode acioná-los pelo microfone ou compartilhar links para sons específicos. Seja jogando com amigos ou só relaxando no chat de voz, ter acesso instantâneo a milhares de sons divertidos muda completamente o clima.",
      howItWorksTitle: "Como Isso Realmente Funciona",
      howItWorksStep1Label: "Encontre o que quer:",
      linkBrowseCategories: "navegue por categorias",
      howItWorksStep1Rest: " ou use a barra de busca acima para encontrar algo específico.",
      howItWorksStep2Label: "Clique:",
      howItWorksStep2Rest: " O som toca imediatamente. Sem carregamento, sem buffering, sem atrasos chatos.",
      howItWorksStep3Label: "Salve os bons:",
      howItWorksStep3Rest: " Clique no ícone de coração nos sons que ama e eles vão para seus favoritos.",
      whyExistsTitle: "Por Que Este Site Existe",
      whyExistsParagraph1:
        "A maioria dos sites de soundboard está bloqueada em todo lugar ou cheia de lixo aleatório que as pessoas enviaram. Queríamos algo diferente. Algo que funcionasse de forma confiável e só tivesse sons genuinamente bons. Não exageramos sobre o desbloqueado - testamos em redes escolares, WiFi corporativo, computadores de bibliotecas públicas, em todo lugar que pensamos.",
      whyExistsParagraph2:
        "Não deixamos ninguém enviar nada. Cada som passa pela nossa equipe primeiro. O áudio está limpo? É algo que as pessoas realmente usariam? Se encaixa na nossa coleção? Se a resposta a qualquer um for não, não sobe. Isso mantém a qualidade consistente e a biblioteca realmente útil em vez de bagunçada.",
      faqTitle: "Perguntas Frequentes",
      faq1Question: "É realmente grátis?",
      faq1Answer:
        "É genuinamente grátis. Sem custos ocultos, sem assinaturas, sem versão premium. Tudo que você vê está disponível para todos.",
      faq2Question: "Realmente funciona na escola?",
      faq2Answer:
        "Para a maioria das pessoas, sim. Milhares de estudantes nos disseram que funciona em suas redes escolares. Obviamente não podemos garantir cada escola porque algumas têm filtros bem extremos, mas funciona na vasta maioria das redes restritas.",
      faq3Question: "Posso usar para vídeos do YouTube?",
      faq3Answer:
        "Sim, as pessoas fazem o tempo todo. A maioria são sons de memes ou material de domínio público ok para usar em conteúdo. Se planeja monetizar vídeos, talvez queira ter cuidado com certos clipes de filmes ou TV, mas em geral são feitos para uso em conteúdo.",
      faq4Question: "Há limite de quantos sons posso tocar?",
      faq4Answer: "Não. Clique à vontade. Toque o mesmo som 500 vezes se for sua vibe. Não limitamos uso porque seria ridículo.",
      founderLabel: "Siya P — Fundador e Criador do SoundButtons.com",
      whyStartedP1:
        "Criei o SoundButtons.com com uma missão simples: fornecer botões de som gratuitos e de alta qualidade acessíveis a todos, especialmente crianças, criadores, streamers e estudantes. Crescendo, percebi que a maioria dos sites de soundboard estava bloqueada na escola, exigia downloads ou tinha áudio de má qualidade. Isso me frustrava e a muitos outros que só queriam se divertir com sons.",
      whyStartedP2:
        "Queria construir algo diferente - uma plataforma onde crianças pudessem explorar com segurança sons divertidos e botões de memes sem se preocupar com restrições. Um lugar onde criadores e streamers pudessem encontrar efeitos sonoros de qualidade de transmissão instantaneamente. Um recurso que estudantes pudessem usar para projetos escolares ou só por diversão nos intervalos, sem serem bloqueados por filtros de rede.",
      whyStartedP3:
        "SoundButtons.com é minha forma de retribuir à comunidade. Cada som é curado à mão por qualidade, cada recurso é projetado pensando no usuário, e tudo é completamente grátis. Sem custos ocultos, sem níveis premium, sem besteira. Apenas botões de som de qualidade que funcionam quando e onde você precisa.",
      whyStartedP4:
        "Seja você uma criança procurando sons divertidos, um criador precisando de efeitos sonoros para seus vídeos, um streamer querendo melhorar suas transmissões ou alguém que curte sons de memes - SoundButtons.com está aqui para você. Isso é mais que um site; é uma ferramenta para criatividade, entretenimento e diversão.",
      emailLabel: "Email:",
      phoneLabel: "Telefone:",
      addressLabel: "Endereço:",
      addressValue: "2847 Digital Avenue, Suite 102, San Francisco, CA 94105, United States",
      finalPart1:
        "SoundButtons não tenta ser uma plataforma revolucionária. É só um lugar sólido e confiável para encontrar efeitos sonoros de qualidade que funciona em todo lugar e não perde seu tempo. Sem truques, sem besteira, só sons que funcionam quando você precisa. ",
      linkCheckOutCollection: "Confira a coleção",
      finalPart2: "—é grátis e leva tipo 10 segundos.",
      readIn: "Ler em:",
      langEn: "English",
      langEs: "Español",
      langPt: "Português",
      langFr: "Français",
    },
    category: {
      categories: "Categorias",
      subcategories: "Subcategorias",
      exploreMore: "Explore mais com nossos",
      newSounds: "novos sons",
      trending: "sons em alta",
      allCategories: "todas as categorias",
    },
    common: {
      loadMore: "Carregar mais",
      viewAll: "Ver tudo",
      loading: "Carregando...",
      noSoundsFound: "Nenhum som encontrado",
    },
    aiSoundButtons: {
      heroTitle: "Botões de Som IA",
      heroDescription: "Peça uma categoria ou descreva o que quer — toque sons na hora.",
      quickQuestionsLabel: "Escolhas rápidas",
      inputPlaceholder: "ex. memes, sons de cachorro, risada...",
      ask: "Perguntar",
      sending: "Enviando...",
      thinking: "Pensando...",
      noMatch: "Nenhuma categoria. Tente uma opção rápida ou digite algo como \"memes engraçados\".",
      noSoundsInCategory: "Nenhum som encontrado.",
      errorMessage: "Algo deu errado. Tente novamente.",
      showMore: "Ver mais",
      showingXOfY: "Mostrando {shown} de {total}",
      soundButtonsLabel: "Botões de Som",
      welcomeTitle: "Bem-vindo aos Botões de Som IA",
      welcomeSubtitle: "Clique em uma opção rápida ou digite o que quer ouvir.",
      tryCategoryBelow: "Tente uma categoria abaixo ou digite o que quiser.",
      hereAreCategory: "Aqui estão alguns botões de som de {name}:",
      hereAreSearch: "Aqui estão sons para \"{query}\":",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      soundEffects: "Effets Sonores",
      new: "Nouveau",
      trending: "Tendances",
      categories: "Catégories",
      memeSoundboard: "Table d'harmonie des mèmes",
      playRandom: "Jouer Aléatoire",
      addMoreFun: "Plus de Fun",
      aiSoundButtons: "Boutons Son IA",
      textToSound: "Texte vers Son",
      leaderboard: "Classement",
      createSound: "Créer un Son",
      kidsSoundboard: "Soundboard Enfants",
      searchPlaceholder: "Rechercher",
      joinFree: "S'inscrire Gratuitement",
      login: "Connexion",
      register: "S'inscrire",
      upload: "Télécharger",
      menu: "Menu",
      signedInAs: "Connecté en tant que",
      myProfile: "Mon profil",
      mySoundboard: "Ma table d'harmonie",
      myFavorites: "Favoris",
      logout: "Déconnexion",
    },
    footer: {
      whyChoose: "Pourquoi choisir SoundButtons.com ?",
      specialPages: "Pages Spéciales",
      categories: "Catégories",
      support: "Support",
      contactInfo: "Informations de Contact",
      viewAllCategories: "Voir Toutes les Catégories",
      home: "Accueil",
      soundButtonsUnblocked: "Sound Buttons Débloqués",
      soundButtonsForSchool: "Sound Buttons pour l'École",
      soundboard: "Soundboard",
      textToSound: "Texte vers Son",
      createSound: "Créer un Son",
      playRandom: "Jouer un Son Aléatoire",
      newSoundButtons: "Nouveaux Sound Buttons",
      trending: "Tendances",
      userReviews: "Avis des Utilisateurs",
      games: "Jeux",
      kidsSoundboard: "Soundboard Enfants",
      soundEffects: "Effets Sonores",
      signIn: "Connexion",
      createAccount: "Créer un Compte",
      aboutUs: "À Propos",
      contactUs: "Contact",
      privacyPolicy: "Politique de Confidentialité",
      termsOfUse: "Conditions d'Utilisation",
      siteMap: "Plan du Site",
      downloadAppGoogle: "Télécharger l'app sur Google Play",
      downloadAppApple: "Télécharger l'app sur l'App Store",
      whyChooseParagraph:
        "SoundButtons.com est une plateforme qui vous permet de créer vos propres boutons sonores depuis n'importe quel appareil. C'est gratuit pour créer des soundboards de mèmes, effets sonores et plus.",
    },
    home: {
      heroTitle: "Boutons sonores et table d'harmonie de mèmes : 100 000+ boutons de mèmes débloqués",
      heroDescription:
        "Découvrez une vaste collection de boutons sonores hilarants, de sons viraux débloqués et de tables d'harmonie, le tout gratuitement ! Créez des boutons sonores personnalisés depuis votre smartphone, ordinateur, Chromebook ou tablette.",
      searchPlaceholder: "Rechercher",
      trendingTitle: "Boutons sonores : Tendances",
      newTitle: "Boutons sonores : Nouvelle table d'harmonie",
      viewAll: "Voir tout",
      view: "Voir",
      loadMoreSounds: "Charger plus de sons",
      aboutTitle: "À propos de SoundButtons.com",
      autoPlay: "Lecture automatique",
      stopAuto: "Arrêter auto",
      randomPlay: "Lecture aléatoire",
      stopRandom: "Arrêter aléatoire",
      autoShort: "Auto",
      stopShort: "Arrêter",
      randomShort: "Aléatoire",
    },
    search: {
      pageTitle: "Rechercher Sound Buttons",
      noResults: "Aucun son trouvé. Essayez une autre recherche.",
      loadMore: "Charger plus",
      resultsTitleTemplate: "{query} - Boutons Sonores | SoundButtons.com",
      heroTitleTemplate: "{count} boutons sonores {query}",
      heroDescriptionTemplate: "Trouvé {count} boutons sonores - gratuits à écouter et télécharger",
      searchMorePlaceholder: "Rechercher plus... (ex. meme, fart, game)",
      soundListTitleTemplate: "{query} boutons sonores",
      loadingMore: "Chargement de plus de sons...",
      scrollForMore: "Faites défiler pour plus de sons",
      browseCategories: "Parcourir les catégories",
      trendingSounds: "Sons tendance",
      tryDifferentSearch: "Essayez d'autres mots-clés ou parcourez nos catégories",
    },
    soundDetail: {
      youMightLike: "Vous aimerez aussi",
      aboutThisSound: "À propos de ce son",
      howToUse: "Comment utiliser ce son",
      popularUses: "Utilisations populaires",
      exploreMoreSounds: "Explorer plus de sons",
      moreCategorySounds: "Plus de sons {category}",
      trending: "Tendances",
      newSounds: "Nouveaux sons",
      soundboard: "Soundboard",
      download: "Télécharger",
      share: "Partager",
      addToFavorites: "Ajouter aux favoris",
      removeFromFavorites: "Retirer des favoris",
      playInstantly: "Jouer instantanément :",
      downloadForFree: "Télécharger gratuitement :",
      useInContent: "Utiliser dans du contenu :",
      shareWithFriends: "Partager avec des amis :",
    },
    about: {
      aboutTitle: "À propos de SoundButtons.com",
      authorCreator: "Auteur et Créateur",
      whyStartedTitle: "Pourquoi j'ai créé SoundButtons",
      contactInfoTitle: "Coordonnées",
    },
    aboutContent: {
      mainTitle: "SoundButtons.com : Votre Dose Quotidienne de Chaos d'Effets Sonores - La Table d'Harmonie de Mèmes Ultime 2026",
      tableOfContents: "Table des matières",
      tocIntroduction: "Introduction",
      tocWhatAreSoundButtons: "Que sont les Boutons Sonores ?",
      tocWhatYouGet: "Ce que Vous Obtenez Vraiment Ici",
      tocQualitySounds: "Des Sons qui N'ont Pas l'Air de Déchets",
      tocWorksEverywhere: "Fonctionne à l'École, au Travail, Partout",
      tocEasyToUse: "Cliquez et Ça Joue",
      tocOrganization: "Comment Nous Avons Organisé Tout Ça",
      tocMemeSoundboard: "Table d'Harmonie de Mèmes",
      tocStreamers: "Parfait pour les Streamers et Créateurs",
      tocDiscord: "Parfait pour Discord et Traîner",
      tocHowItWorks: "Comment Ça Marche Vraiment",
      tocWhyExists: "Pourquoi Ce Site Existe",
      tocFaq: "Questions Fréquentes",
      tocAboutContact: "À propos et Contact",
      welcomeBefore:
        "Bienvenue sur SoundButtons.com ! Que vous cherchiez ce Vine boom parfait pour votre serveur Discord ou ayez besoin d'une table d'harmonie qui fonctionne à l'école, vous avez trouvé le bon endroit. Des milliers de personnes en ont fait leur spot préféré pour ",
      linkMemeSounds: "les sons de mèmes",
      welcomeAfter: " et les clips audio drôles.",
      welcomeParagraph2:
        "Nous avons créé ce site parce que nous en avions marre des tables d'harmonie bloquées, pleines de sons de mauvaise qualité ou si encombrées qu'on ne trouve rien. Alors nous avons tout corrigé.",
      whatAreSoundButtonsTitle: "Que sont les Boutons Sonores ?",
      whatAreSoundButtonsPart1:
        "Les boutons sonores sont des boutons interactifs cliquables qui jouent des clips audio instantanément quand vous cliquez - pas de téléchargements ni d'installations. Sur SoundButtons.com, nous offrons la plus grande collection gratuite de ",
      linkMemeSoundButtons: "boutons sonores de mèmes",
      whatAreSoundButtonsPart2: ", ",
      linkFunnySoundButtons: "boutons sonores drôles",
      whatAreSoundButtonsPart3: ", ",
      linkSoundEffects: "effets sonores",
      whatAreSoundButtonsPart4: " et ",
      linkTrendingSoundButtons: "boutons sonores tendance",
      whatAreSoundButtonsPart5:
        ". Nos boutons sonores fonctionnent instantanément dans tout navigateur sur ordinateurs, téléphones, tablettes, et même à l'école où d'autres sites peuvent être bloqués. Parfait pour les ",
      linkContentCreators: "créateurs de contenu",
      whatAreSoundButtonsPart6:
        ", streamers, étudiants et tous ceux qui veulent un accès instantané à des clips audio de qualité - le tout gratuitement sans inscription.",
      whatYouGetTitle: "Ce que Vous Obtenez Vraiment Ici",
      whatYouGetPart1: "Nous avons construit une collection massive de ",
      linkTrendingSoundButtons2: "boutons sonores tendance",
      whatYouGetPart2:
        " ces dernières années. De clips classiques de table d'harmonie de mèmes à cet effet sonore bizarre que vous avez entendu sur TikTok la semaine dernière. Tout fonctionne dans votre navigateur, pas de téléchargements, jamais.",
      qualitySoundsTitle: "Des Sons qui N'ont Pas l'Air de Déchets",
      qualitySoundsPart1:
        "Chaque son est un audio propre. Nous écoutons vraiment tout avant de l'ajouter. Si ça sonne étouffé ou que les niveaux sont n'importe où, ça ne passe pas. Nous avons vos ",
      linkMemeButtons: "boutons de mèmes",
      qualitySoundsPart2:
        " standard, et nous fouillons aussi constamment sur internet pour de nouveaux sons tendance. Quand quelque chose devient viral, nous l'avons généralement en quelques jours.",
      worksEverywhereTitle: "Fonctionne à l'École, au Travail, Partout",
      worksEverywherePart1:
        "C'est probablement la raison principale pour laquelle les gens restent. Notre site fonctionne sur les réseaux restreints. Nous avons passé beaucoup de temps à tester sur différents réseaux car se faire bloquer est incroyablement énervant. C'est une vraie ",
      linkSoundboardUnblocked: "table d'harmonie débloquée",
      worksEverywherePart2: " sur laquelle vous pouvez vraiment compter.",
      easyToUseTitle: "Cliquez et Ça Joue",
      easyToUseContent:
        'Pas de formulaires d\'inscription. Pas de vérification par email. Pas de connerie "regardez cette pub d\'abord". Vous voyez un son que vous voulez, vous cliquez, ça joue immédiatement. Vous voulez utiliser des sons sur votre téléphone ? Ça marche super. Tablette ? Ouais. Votre vieux laptop de 2015 ? Probablement ok.',
      organizationTitle: "Comment Nous Avons Organisé Tout Ça",
      organizationIntro: "Avec des milliers de sons, l'organisation compte. Parcourez par catégorie :",
      linkMemeSection: "La Section Mèmes",
      organizationMemeDesc: " — Chaque clip de table d'harmonie de mèmes que vous avez toujours voulu",
      linkFunnyStuff: "Trucs Drôles",
      organizationFunnyDesc: " — Conçu pour faire craquer vos amis",
      linkGamingSounds: "Sons de Jeux",
      organizationGamingDesc: " — Sons iconiques de jeux populaires",
      linkMovieTvClips: "Clips de Films et Séries",
      organizationMovieDesc: " — Citations célèbres et moments dramatiques",
      linkSoundEffects2: "Effets Sonores",
      organizationEffectsDesc: " — Tons et effets professionnels pour alertes",
      memeSoundboardTitle: "Table d'Harmonie de Mèmes",
      memeSoundboardPart1: "Notre ",
      linkMemeSoundboard: "table d'harmonie de mèmes",
      memeSoundboardPart2:
        " est le cœur de SoundButtons.com. C'est là que vivent tous les clips de table d'harmonie de mèmes que vous avez toujours voulus. Des Vine boom classiques aux dernières tendances TikTok, notre collection de table d'harmonie de mèmes est constamment mise à jour avec les sons les plus viraux. Que vous cherchiez des sons de réaction, des clips drôles ou ce bouton de mème parfait pour votre serveur Discord, notre ",
      linkMemeSoundboard2: "table d'harmonie de mèmes",
      memeSoundboardPart3: " vous a couvert.",
      memeSoundboardPart4:
        "Qu'est-ce qui rend notre table d'harmonie de mèmes spéciale ? Chaque son est sélectionné à la main pour la qualité et la pertinence. On ne balance pas des fichiers audio aléatoires - on sélectionne les meilleurs sons de mèmes que les gens veulent vraiment utiliser. Quand un nouveau mème devient viral, nous sommes généralement parmi les premiers à l'avoir sur notre table d'harmonie de mèmes. De plus, notre table d'harmonie de mèmes fonctionne partout, même sur les réseaux restreints, ce qui en fait la table d'harmonie de mèmes débloquée parfaite pour l'école, le travail ou ailleurs.",
      streamersTitle: "Parfait pour les Streamers et Créateurs",
      streamersPart1:
        "Chaque bouton sonore ici est de qualité diffusion. Ce sont des clips propres, bien nivelés, bien montés qui ne feront pas passer votre stream pour amateur. On essaie de suivre les tendances, en ajoutant de nouveaux ",
      linkMemeButtons2: "boutons de mèmes",
      streamersPart2:
        " quasiment chaque semaine. Notre recherche fonctionne bien (utilisez la barre de recherche en haut), et vous pouvez sauvegarder des favoris pour un accès rapide.",
      discordTitle: "Parfait pour Discord et Traîner",
      discordContent:
        "Jouer des sons via Discord est super facile. Vous pouvez les déclencher via votre micro ou partager des liens vers des sons spécifiques. Que ce soit en jouant avec des amis ou en traînant en chat vocal, avoir un accès instantané à des milliers de sons drôles change complètement l'ambiance.",
      howItWorksTitle: "Comment Ça Marche Vraiment",
      howItWorksStep1Label: "Trouvez ce que vous voulez :",
      linkBrowseCategories: "parcourez les catégories",
      howItWorksStep1Rest: " ou utilisez la barre de recherche ci-dessus pour trouver quelque chose de spécifique.",
      howItWorksStep2Label: "Cliquez :",
      howItWorksStep2Rest: " Le son joue immédiatement. Pas de chargement, pas de buffering, pas de retards énervants.",
      howItWorksStep3Label: "Sauvegardez les bons :",
      howItWorksStep3Rest: " Cliquez sur l'icône cœur sur les sons que vous aimez et ils seront sauvegardés dans vos favoris.",
      whyExistsTitle: "Pourquoi Ce Site Existe",
      whyExistsParagraph1:
        "La plupart des sites de tables d'harmonie sont soit bloqués partout soit pleins de déchets aléatoires que les gens ont envoyés. Nous voulions quelque chose de différent. Quelque chose qui fonctionnait vraiment de façon fiable et n'avait que de vrais bons sons. On n'exagère pas pour le déblocage - on a testé sur les réseaux scolaires, le WiFi d'entreprise, les ordinateurs de bibliothèques publiques, partout où on pouvait penser.",
      whyExistsParagraph2:
        "Nous ne laissons personne envoyer quoi que ce soit. Chaque son est vérifié par notre équipe d'abord. L'audio est-il propre ? Est-ce quelque chose que les gens utiliseraient vraiment ? Est-ce que ça rentre dans notre collection ? Si la réponse à l'une de ces questions est non, ça ne monte pas. Ça garde la qualité cohérente et la bibliothèque vraiment utile au lieu d'encombrée.",
      faqTitle: "Questions Fréquentes",
      faq1Question: "C'est vraiment gratuit ?",
      faq1Answer:
        "C'est vraiment gratuit. Pas de coûts cachés, pas d'abonnements, pas de version premium. Tout ce que vous voyez est disponible pour tout le monde.",
      faq2Question: "Ça marche vraiment à l'école ?",
      faq2Answer:
        "Pour la plupart des gens, oui. Des milliers d'étudiants nous ont dit que ça marche sur leurs réseaux scolaires. Évidemment on ne peut pas garantir chaque école car certaines ont des filtres vraiment extrêmes, mais ça marche sur la grande majorité des réseaux restreints.",
      faq3Question: "Puis-je utiliser ça pour des vidéos YouTube ?",
      faq3Answer:
        "Oui, les gens le font tout le temps. La plupart sont des sons de mèmes ou du domaine public qu'on peut utiliser dans du contenu. Si vous prévoyez de monétiser des vidéos, vous voudrez peut-être faire attention avec certains clips de films ou séries, mais en général c'est fait pour être utilisé dans du contenu.",
      faq4Question: "Y a-t-il une limite au nombre de sons que je peux jouer ?",
      faq4Answer:
        "Non. Cliquez à volonté. Joue le même son 500 fois si c'est ton truc. On ne limite pas l'utilisation car ce serait ridicule.",
      founderLabel: "Siya P — Fondateur et Créateur de SoundButtons.com",
      whyStartedP1:
        "J'ai créé SoundButtons.com avec une mission simple : fournir des boutons sonores gratuits et de haute qualité accessibles à tous, surtout aux enfants, créateurs, streamers et étudiants. En grandissant, j'ai remarqué que la plupart des sites de tables d'harmonie étaient soit bloqués à l'école, exigeaient des téléchargements ou avaient un audio de mauvaise qualité. Ça me frustrait moi et beaucoup d'autres qui voulaient juste s'amuser avec des sons.",
      whyStartedP2:
        "Je voulais construire quelque chose de différent - une plateforme où les enfants pourraient explorer en toute sécurité des sons drôles et des boutons de mèmes sans s'inquiéter des restrictions. Un endroit où les créateurs et streamers pourraient trouver des effets sonores de qualité diffusion instantanément. Une ressource que les étudiants pourraient utiliser pour des projets scolaires ou juste pour s'amuser pendant les pauses, sans être bloqués par les filtres réseau.",
      whyStartedP3:
        "SoundButtons.com est ma façon de redonner à la communauté. Chaque son est sélectionné à la main pour la qualité, chaque fonction est conçue en pensant à l'utilisateur, et tout est complètement gratuit. Pas de coûts cachés, pas de niveaux premium, pas de conneries. Juste des boutons sonores de qualité qui fonctionnent quand et où vous en avez besoin.",
      whyStartedP4:
        "Que vous soyez un enfant cherchant des sons drôles, un créateur ayant besoin d'effets sonores pour vos vidéos, un streamer voulant améliorer vos diffusions ou quelqu'un qui aime les sons de mèmes - SoundButtons.com est là pour vous. C'est plus qu'un site web ; c'est un outil pour la créativité, le divertissement et le plaisir.",
      emailLabel: "Email :",
      phoneLabel: "Téléphone :",
      addressLabel: "Adresse :",
      addressValue: "2847 Digital Avenue, Suite 102, San Francisco, CA 94105, United States",
      finalPart1:
        "SoundButtons n'essaie pas d'être une plateforme révolutionnaire. C'est juste un endroit solide et fiable pour trouver des effets sonores de qualité qui fonctionne partout et ne fait pas perdre votre temps. Pas de gadgets, pas de conneries, juste des sons qui fonctionnent quand vous en avez besoin. ",
      linkCheckOutCollection: "Découvrez la collection",
      finalPart2: "—c'est gratuit et ça prend genre 10 secondes.",
      readIn: "Lire en :",
      langEn: "English",
      langEs: "Español",
      langPt: "Português",
      langFr: "Français",
    },
    category: {
      categories: "Catégories",
      subcategories: "Sous-catégories",
      exploreMore: "Explorez plus avec nos",
      newSounds: "nouveaux sons",
      trending: "sons tendance",
      allCategories: "toutes les catégories",
    },
    common: {
      loadMore: "Charger plus",
      viewAll: "Voir tout",
      loading: "Chargement...",
      noSoundsFound: "Aucun son trouvé",
    },
    aiSoundButtons: {
      heroTitle: "Boutons Son IA",
      heroDescription: "Demandez une catégorie ou décrivez ce que vous voulez — jouez des sons instantanément.",
      quickQuestionsLabel: "Choix rapides",
      inputPlaceholder: "ex. memes, pets, aboiements...",
      ask: "Demander",
      sending: "Envoi...",
      thinking: "Réflexion...",
      noMatch: "Aucune catégorie. Essayez un choix rapide ou tapez par ex. \"memes drôles\".",
      noSoundsInCategory: "Aucun son trouvé.",
      errorMessage: "Une erreur s'est produite. Réessayez.",
      showMore: "Voir plus",
      showingXOfY: "Affichage de {shown} sur {total}",
      soundButtonsLabel: "Boutons Son",
      welcomeTitle: "Bienvenue sur Boutons Son IA",
      welcomeSubtitle: "Cliquez sur un choix rapide ou tapez ce que vous voulez écouter.",
      tryCategoryBelow: "Essayez une catégorie ci-dessous ou tapez votre demande.",
      hereAreCategory: "Voici des boutons son de {name} :",
      hereAreSearch: "Voici des sons pour « {query} » :",
    },
  },
}

export function getStrings(locale: Locale): LocaleStrings {
  return strings[locale] ?? strings.en
}

export function getLocaleFromPathname(pathname: string): Locale {
  if (pathname.startsWith("/es")) return "es"
  if (pathname.startsWith("/pt")) return "pt"
  if (pathname.startsWith("/fr")) return "fr"
  return "en"
}

export function getLocalePrefix(pathname: string): string {
  if (pathname.startsWith("/es")) return "/es"
  if (pathname.startsWith("/pt")) return "/pt"
  if (pathname.startsWith("/fr")) return "/fr"
  return ""
}

/** Breadcrumb label keys for JSON-LD schema so locale pages use the same strings as UI. */
export function getBreadcrumbLabels(locale: Locale): {
  home: string
  categories: string
  search: string
  new: string
  trending: string
} {
  const s = getStrings(locale)
  return {
    home: s.nav.home,
    categories: s.category.categories,
    search: s.search.pageTitle,
    new: s.nav.new,
    trending: s.nav.trending,
  }
}
