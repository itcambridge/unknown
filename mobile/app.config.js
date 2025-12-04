export default {
  name: "Beach Cache Detection",
  slug: "beach-cache-detection",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#020617" // slate-950
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.beachcache.mobile"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#020617" // slate-950
    },
    package: "com.beachcache.mobile"
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
    backendUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8000"
  }
}
