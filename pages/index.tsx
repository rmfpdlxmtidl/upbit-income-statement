import Head from 'next/head'
import Image from 'next/image'
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'

function Home() {
  const posts = [{ id: 1, title: '' }]
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>,
  )
      }
export async function getStaticProps() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  }
}

export default Home
