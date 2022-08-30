import { useRouter } from 'next/router'
import Layout from 'components/Layout'
import Head from 'next/head'
import useCollectionStats from 'hooks/useCollectionStats'



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

      <div className='relative flex justify-center col-span-full mt-36 '>

      <div className='col-span-full md:w-2/3 px-10'>

        <div className='col-span-full font-pixeloid text-5xl md:text-7xl'>
          <text>
        New Bros,<br></br>
        Every Week,<br></br>
        Until XBOX
        </text>
        </div>

        {/* <div className='pt-10 col-span-full font-pixeloid'>
        New Bros
       </div> */}

       <div className='bg-slate-900  mt-10 col-span-full relative p-8 justify-center text-xl font-pixeloid'>
      A speedrun of video game history in 360 characters.
      <div className='flex mt-4 text-lg font-pixeloid'>
        360 Total - {stats?.data?.stats?.tokenCount} / 360
      </div>
      <div className="w-full md:w-3/4 mt-4 bg-gray-200 dark:bg-gray-700 border-2">
      <div className="bg-white h-2.5 w-[52%]" ></div>
      </div>


      </div>
      </div>
      </div>

      </Layout>
  )
}

export default About
