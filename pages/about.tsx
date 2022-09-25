import { useRouter } from 'next/router'
import Layout from 'components/Layout'
import Head from 'next/head'
import useCollectionStats from 'hooks/useCollectionStats'
import Link from 'next/link'



const About = () => {
  const router = useRouter()

  const title = "GameBros"
  const description = process.env.NEXT_PUBLIC_META_DESCRIPTION
  const image = process.env.NEXT_PUBLIC_META_OG_IMAGE

  const stats = useCollectionStats(router, "0x1f63ef5e95b3b2541f2b148bf95bfc34201b77cd")
  const tokenCount = stats?.data?.stats?.tokenCount ?? 0


  return (

    <Layout navbar={{}}>
      <Head>
        {title}
        {description}
        {image}
      </Head>

      <div className='relative flex justify-center col-span-full mt-36  '>

      <div className='col-span-full md:w-2/3 px-10'>

        <div className='mt-10 col-span-full font-pixeloid text-5xl md:text-7xl'>
          <text>
        New Bros,<br></br>
        Every Week,<br></br>
        Until XBOX
        </text>
        </div>

        {/* <div className='pt-10 col-span-full font-pixeloid'>
        New Bros
       </div> */}

       <div className='mt-10 mb-10 col-span-full relative justify-center text-xl font-pixeloid'>
      <div className='flex mt-4 text-lg font-pixeloid'>
        360 Total - {stats?.data?.stats?.tokenCount} / 360
      </div>
      <div className="w-full md:w-3/4 mt-4 bg-gray-200 dark:bg-gray-700 border-2">
      <div className="bg-white h-2.5 w-[58%]" ></div>
      </div>

       <Link href="https://twitter.com/BKK_BROS" target="_blank" passHref>
       <a target="_blank">
         <div className='mt-10 p-4 md:w-3/4 bg-white font-pixeloid col-span-full text-center text-black cursor-pointer hover:bg-gray-500'>
       <div className='animate-pulse text-red-800'>
       Next Drop Alerts
       </div>
       </div>
       </a></Link>


      </div>
      <div className='col-span-full font-pixeloid text-4xl md:text-5xl'>
          <text>
        WTF?
        </text>
        </div>

        <div className='mt-5 col-span-full font-pixeloid text-2xl md:text-3xl md:w-3/4'>
          <text>
          GameBros is a speedrun of video game history in 360 bros. All bros are unique, one of one creations from the artist <Link href="https://twitter.com/BKK_BROS"><a target="_blank">BKKBROS</a></Link>. 
        </text>
        </div>
      </div>
      </div>

      <div className='text-xs md:text-base mt-20 mb-20 md:mt-40 text-center font-pixeloid col-span-full relative'>
    GameBros 2022 - Made With ❤ from Bangkok
    </div>

      </Layout>
  )
}

export default About
