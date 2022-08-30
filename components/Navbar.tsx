import { FC, ReactElement, useEffect, useState } from 'react'
import ConnectWallet from './ConnectWallet'
import HamburgerMenu from './HamburgerMenu'
import dynamic from 'next/dynamic'
import { paths } from '@reservoir0x/reservoir-kit-client'
import setParams from 'lib/params'
import NavbarLogo from 'components/navbar/NavbarLogo'
import ThemeSwitcher from './ThemeSwitcher'
import * as Popover from '@radix-ui/react-popover'
import { FaShoppingCart } from 'react-icons/fa'
import CartMenu from './CartMenu'
import Link from 'next/link'

const SearchCollections = dynamic(() => import('./SearchCollections'))
const CommunityDropdown = dynamic(() => import('./CommunityDropdown'))
const EXTERNAL_LINKS = process.env.NEXT_PUBLIC_EXTERNAL_LINKS || null
const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION
const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY
const COLLECTION_SET_ID = process.env.NEXT_PUBLIC_COLLECTION_SET_ID
const DEFAULT_TO_SEARCH = process.env.NEXT_PUBLIC_DEFAULT_TO_SEARCH

function getInitialSearchHref() {
  const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE
  const pathname = `${PROXY_API_BASE}/search/collections/v1`
  const query: paths['/search/collections/v1']['get']['parameters']['query'] =
    {}

  if (COLLECTION_SET_ID) {
    query.collectionsSetId = COLLECTION_SET_ID
  } else {
    if (COMMUNITY) query.community = COMMUNITY
  }

  return setParams(pathname, query)
}

const Navbar: FC = () => {
  const [showLinks, setShowLinks] = useState(true)
  const [filterComponent, setFilterComponent] = useState<ReactElement | null>(
    null
  )

  const externalLinks: { name: string; url: string }[] = []

  if (typeof EXTERNAL_LINKS === 'string') {
    const linksArray = EXTERNAL_LINKS.split(',')

    linksArray.forEach((link) => {
      let values = link.split('::')
      externalLinks.push({
        name: values[0],
        url: values[1],
      })
    })
  }

  const isGlobal = !COMMUNITY && !COLLECTION && !COLLECTION_SET_ID
  const filterableCollection = isGlobal || COMMUNITY || COLLECTION_SET_ID

  useEffect(() => {
    setShowLinks(externalLinks.length > 0)
  }, [])

  useEffect(() => {
    if (filterableCollection) {
      const href = getInitialSearchHref()

      fetch(href).then(async (res) => {
        let initialResults = undefined

        if (res.ok) {
          initialResults =
            (await res.json()) as paths['/search/collections/v1']['get']['responses']['200']['schema']
        }

        const smallCommunity =
          initialResults?.collections &&
          initialResults.collections.length >= 2 &&
          initialResults.collections.length <= 10

        if (
          !DEFAULT_TO_SEARCH &&
          (COMMUNITY || COLLECTION_SET_ID) &&
          smallCommunity
        ) {
          setFilterComponent(
            <CommunityDropdown
              collections={initialResults?.collections}
              defaultCollectionId={COLLECTION}
            />
          )
        } else {
          setShowLinks(false)
          setFilterComponent(
            <SearchCollections
              communityId={COMMUNITY}
              initialResults={initialResults}
            />
          )
        }
      })
    }
  }, [filterableCollection])

  return (
    <nav className="col-span-full fixed z-50 flex w-full max-w-[2560px] items-center justify-between gap-2 px-6 py-4 bg-gradient-to-b from-black to-background-opacity-0 md:gap-3 md:py-12 md:px-16">
      <NavbarLogo className="z-10 max-w-[300px]" />
      {showLinks && (
        <div className="z-10 ml-12 hidden items-center gap-11 lg:flex">
          {externalLinks.map(({ name, url }) => (
            <a
              key={url}
              href={url}
              rel="noopener noreferrer"
              target="_blank"
              className="text-dark reservoir-h6 hover:text-[#1F2937] dark:text-white"
            >
              {name}
            </a>
          ))}
        </div>
      )}
      <div className="flex h-full w-full items-center justify-center">
        <div className="z-[1] flex w-full justify-center">
          {filterComponent && filterComponent}
        </div>
      </div>
      <HamburgerMenu externalLinks={externalLinks} />
      <div className="z-10 ml-auto hidden shrink-0 md:flex md:gap-2">


      <Link href={`https://discord.gg/bw8RmzKN`} passHref>
      <a target="_blank">
      <div className='btn-primary-outline px-2 dark:bg-opacity-50 dark:hover:bg-opacity-75 border-0 font-pixeloid ml-auto border-transparent bg-gray-100 normal-case dark:border-neutral-600 dark:bg-neutral-900 dark:ring-primary-900 dark:focus:ring-4'>
      <svg xmlns="http://www.w3.org/2000/svg" className=" fill-current stroke-current h-6 w-6" viewBox="0 0 40 40"><path d="M33.567 7.554a32.283 32.283 0 00-7.969-2.472.12.12 0 00-.128.06c-.344.613-.725 1.411-.992 2.039a29.804 29.804 0 00-8.95 0 20.625 20.625 0 00-1.008-2.038.126.126 0 00-.128-.06 32.194 32.194 0 00-7.968 2.47.114.114 0 00-.053.046C1.296 15.18-.095 22.577.588 29.88c.003.036.023.07.05.092 3.349 2.459 6.593 3.952 9.776 4.941a.127.127 0 00.137-.045 23.203 23.203 0 002-3.253.124.124 0 00-.068-.172A21.379 21.379 0 019.43 29.99a.126.126 0 01-.012-.209c.205-.153.41-.313.607-.475a.121.121 0 01.126-.017c6.407 2.925 13.343 2.925 19.675 0a.12.12 0 01.128.015c.196.162.4.324.608.477a.126.126 0 01-.011.209c-.975.57-1.99 1.051-3.055 1.454a.125.125 0 00-.067.173 26.052 26.052 0 001.998 3.252c.031.043.087.062.138.046 3.199-.99 6.442-2.482 9.79-4.941a.126.126 0 00.052-.09c.816-8.445-1.368-15.78-5.789-22.283a.1.1 0 00-.05-.046zm-20.06 17.88c-1.928 0-3.517-1.771-3.517-3.946 0-2.175 1.558-3.946 3.518-3.946 1.975 0 3.549 1.787 3.518 3.946 0 2.175-1.558 3.946-3.518 3.946zm13.01 0c-1.93 0-3.52-1.771-3.52-3.946 0-2.175 1.56-3.946 3.52-3.946 1.974 0 3.548 1.787 3.517 3.946 0 2.175-1.543 3.946-3.518 3.946z"></path></svg>
        </div>
        </a>
        </Link>

        <Link href={`https://twitter.com/gamebrosgg`} passHref>
      <a target="_blank">
        <div className='btn-primary-outline px-2 dark:bg-opacity-50 dark:hover:bg-opacity-75 border-0 font-pixeloid ml-auto border-transparent bg-gray-100 normal-case dark:border-neutral-600 dark:bg-neutral-900 dark:ring-primary-900 dark:focus:ring-4'>
        <svg xmlns="http://www.w3.org/2000/svg" className=" fill-current stroke-current h-6 w-6" viewBox="0 0 40 40"><path d="M38.526 8.625a15.199 15.199 0 01-4.373 1.198 7.625 7.625 0 003.348-4.211 15.25 15.25 0 01-4.835 1.847 7.6 7.6 0 00-5.557-2.404c-4.915 0-8.526 4.586-7.416 9.346-6.325-.317-11.934-3.347-15.69-7.953C2.01 9.869 2.97 14.345 6.358 16.612a7.58 7.58 0 01-3.446-.953c-.084 3.527 2.444 6.826 6.105 7.56a7.63 7.63 0 01-3.438.13 7.618 7.618 0 007.112 5.286A15.306 15.306 0 011.42 31.79a21.55 21.55 0 0011.67 3.42c14.134 0 22.12-11.937 21.637-22.643a15.499 15.499 0 003.799-3.941z"></path></svg>
        </div>
        </a>
        </Link>


        <Link href={`https://www.instagram.com/bkkbros/`} passHref>
      <a target="_blank">
        <div className='btn-primary-outline px-2 dark:bg-opacity-50 dark:hover:bg-opacity-75 border-0 font-pixeloid ml-auto border-transparent bg-gray-100 normal-case dark:border-neutral-600 dark:bg-neutral-900 dark:ring-primary-900 dark:focus:ring-4'>
        <svg xmlns="http://www.w3.org/2000/svg" className=" fill-current stroke-current h-6 w-6" viewBox="0 0 40 40"><path d="M27.524 1.79c3.334.17 5.899 1.11 7.694 2.992 1.796 1.88 2.822 4.36 2.993 7.694 0 1.314.078 3.651.085 7.089v2.108c-.002 2.768-.014 4.702-.085 5.85-.171 3.335-1.112 5.9-2.993 7.695-1.88 1.796-4.36 2.822-7.694 2.993-1.15.071-3.143.083-5.88.085h-3.317c-2.768-.002-4.702-.014-5.85-.085-3.335-.171-5.9-1.112-7.695-2.993-1.796-1.795-2.822-4.36-2.993-7.694-.065-1.04-.08-2.771-.084-5.118v-4.812c.004-2.347.02-4.078.084-5.118.171-3.334 1.112-5.899 2.993-7.694 1.795-1.796 4.36-2.822 7.694-2.993 1.04-.065 2.771-.08 5.118-.084h4.847c2.361.004 4.043.02 5.083.084Zm-7.61 8.805c-2.65 0-4.873.94-6.668 2.736C11.45 15.212 10.51 17.35 10.51 20c0 2.65.94 4.873 2.736 6.669 1.88 1.795 4.018 2.736 6.668 2.736 2.65 0 4.874-.94 6.67-2.736 1.795-1.881 2.735-4.019 2.735-6.669 0-2.65-.94-4.873-2.736-6.669-1.795-1.88-4.018-2.736-6.669-2.736Zm0 3.25c1.71 0 3.164.598 4.36 1.795A6.076 6.076 0 0 1 26.07 20c0 1.624-.598 3.078-1.795 4.275-1.197 1.197-2.65 1.795-4.36 1.795-1.71 0-3.164-.598-4.36-1.795-1.198-1.112-1.796-2.565-1.796-4.275 0-1.71.598-3.163 1.795-4.36 1.197-1.197 2.65-1.796 4.36-1.796Zm9.833-5.9c-.599 0-1.112.257-1.54.684-.427.427-.683.94-.683 1.539 0 .598.256 1.111.684 1.539.427.427.94.684 1.539.684.598 0 1.111-.257 1.538-.684.428-.428.684-.94.684-1.54 0-.598-.256-1.11-.684-1.538-.427-.427-.94-.684-1.538-.684Z"></path></svg>        
        </div>
        </a>
        </Link>

          <Link href={'/about'} passHref>
        <div className='btn-primary-outline cursor-pointer dark:bg-opacity-50 dark:hover:bg-opacity-75 border-0 font-pixeloid ml-auto border-transparent bg-gray-100 normal-case dark:border-neutral-600 dark:bg-neutral-900 dark:ring-primary-900 dark:focus:ring-4'>
      The Game
      </div></Link>

      {/* <div className='btn-primary-outline dark:bg-opacity-50 dark:hover:bg-opacity-75 border-0 font-pixeloid ml-auto border-transparent bg-gray-100 normal-case dark:border-neutral-600 dark:bg-neutral-900 dark:ring-primary-900 dark:focus:ring-4'>
      Merch
      </div> */}

        <ConnectWallet />
        <ThemeSwitcher />
      </div>
      {/* <CartMenu /> */}
    </nav>
  )
}

export default Navbar
