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
  searchPlaceholder: string
  joinFree: string
  login: string
  register: string
  upload: string
  menu: string
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
  loadMoreSounds: string
  aboutTitle: string
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
}

export interface StringsAbout {
  aboutTitle: string
  authorCreator: string
  whyStartedTitle: string
  contactInfoTitle: string
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
      searchPlaceholder: "Search Sound buttons...",
      joinFree: "Join Free",
      login: "Login",
      register: "Register",
      upload: "Upload",
      menu: "Menu",
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
      loadMoreSounds: "Load More Sounds",
      aboutTitle: "About SoundButtons.com",
    },
    search: {
      pageTitle: "Search Sound Buttons",
      noResults: "No sounds found. Try a different search.",
      loadMore: "Load more",
      resultsTitleTemplate: "{query} - Sound Buttons | SoundButtons.com",
      heroTitleTemplate: "{count} {query} Sound Buttons",
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
      searchPlaceholder: "Buscar",
      joinFree: "Unirse Gratis",
      login: "Iniciar Sesión",
      register: "Registrarse",
      upload: "Subir",
      menu: "Menú",
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
      loadMoreSounds: "Cargar más sonidos",
      aboutTitle: "Acerca de SoundButtons.com",
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
      searchPlaceholder: "Pesquisar",
      joinFree: "Cadastre-se Grátis",
      login: "Entrar",
      register: "Cadastrar",
      upload: "Enviar",
      menu: "Menu",
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
      loadMoreSounds: "Carregar mais sons",
      aboutTitle: "Sobre o SoundButtons.com",
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
      searchPlaceholder: "Rechercher",
      joinFree: "S'inscrire Gratuitement",
      login: "Connexion",
      register: "S'inscrire",
      upload: "Télécharger",
      menu: "Menu",
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
      loadMoreSounds: "Charger plus de sons",
      aboutTitle: "À propos de SoundButtons.com",
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
