import Feed from './components/Feed'
import Header from './components/Header'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <Feed />
      </main>
    </div>
  )
}