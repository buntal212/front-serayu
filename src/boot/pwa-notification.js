export default ({ router }) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'OPEN_DETAIL') {
        router.push(event.data.url)
      }
    })
  }
}
