"use client"

import * as React from "react"
import PropTypes from "prop-types"

export function ThemeProvider({
  children,
  attribute = "data-theme",
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "theme",
  disableTransitionOnChange: _disableTransitionOnChange,
}) {
  const [theme, setTheme] = React.useState(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState(
    defaultTheme === "system" ? "light" : defaultTheme,
  )

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const storedTheme = window.localStorage.getItem(storageKey)
    const nextTheme = storedTheme || defaultTheme

    const resolveTheme = (value) =>
      value === "system" && enableSystem
        ? mediaQuery.matches
          ? "dark"
          : "light"
        : value

    const applyTheme = (value) => {
      const resolved = resolveTheme(value)
      const element = document.documentElement
      element.classList.toggle("dark", attribute === "class" && resolved === "dark")
      if (attribute !== "class") {
        element.setAttribute(attribute, resolved)
      }
      setResolvedTheme(resolved)
    }

    setTheme(nextTheme)
    applyTheme(nextTheme)

    const handleSystemThemeChange = () => {
      if (nextTheme === "system") {
        applyTheme("system")
      }
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange)
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange)
  }, [attribute, defaultTheme, enableSystem, storageKey])

  const updateTheme = React.useCallback((nextTheme) => {
    setTheme(nextTheme)
    window.localStorage.setItem(storageKey, nextTheme)
    const resolved = nextTheme === "system" && enableSystem
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : nextTheme
    document.documentElement.classList.toggle("dark", attribute === "class" && resolved === "dark")
    if (attribute !== "class") {
      document.documentElement.setAttribute(attribute, resolved)
    }
    setResolvedTheme(resolved)
  }, [attribute, enableSystem, storageKey])

  const value = React.useMemo(
    () => ({ theme, setTheme: updateTheme, resolvedTheme }),
    [resolvedTheme, setTheme, theme, updateTheme],
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

const ThemeContext = React.createContext({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
})

export function useTheme() {
  return React.useContext(ThemeContext)
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
  attribute: PropTypes.string,
  defaultTheme: PropTypes.string,
  enableSystem: PropTypes.bool,
  storageKey: PropTypes.string,
}