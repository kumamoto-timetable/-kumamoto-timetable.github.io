export const pageView = (path: string) => {
  (window as any).gtag("config", 'G-BTQR4M6W4Y', {
    page_path: path,
  })
}
