import { FC, useState } from 'react'
import LoadingCard from './LoadingCard'
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite'
import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import { useInView } from 'react-intersection-observer'
import FormatEth from './FormatEth'
import Masonry from 'react-masonry-css'
import { paths } from '@reservoir0x/reservoir-kit-client'
import Image from 'next/image'
import { FaShoppingCart } from 'react-icons/fa'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { recoilTokensMap } from './CartMenu'
import { useAccount, useNetwork, useSigner } from 'wagmi'
import BuyNow from 'components/BuyNow'
import {ENSName} from 'react-ens-name'

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const SOURCE_ID = process.env.NEXT_PUBLIC_SOURCE_ID
const NAVBAR_LOGO = process.env.NEXT_PUBLIC_NAVBAR_LOGO
const SOURCE_ICON = process.env.NEXT_PUBLIC_SOURCE_ICON

type Props = {
  tokens: SWRInfiniteResponse<
    paths['/tokens/v4']['get']['responses']['200']['schema'],
    any
  >
  collectionImage: string | undefined
  viewRef: ReturnType<typeof useInView>['ref']
}

type Tokens = NonNullable<
  paths['/tokens/v4']['get']['responses']['200']['schema']['tokens']
>

export const recoilCartTokens = atom<Tokens>({
  key: 'cartTokens',
  default: [],
})

const TokensGrid: FC<Props> = ({ tokens, viewRef, collectionImage }) => {
  const [cartTokens, setCartTokens] = useRecoilState(recoilCartTokens)
  const tokensMap = useRecoilValue(recoilTokensMap)
  const { data: signer } = useSigner()
  const [_open, setOpen] = useState(false)
  const { chain: activeChain } = useNetwork()
  const { data, error } = tokens
  const account = useAccount()

  // Reference: https://swr.vercel.app/examples/infinite-loading
  const mappedTokens = data ? data.flatMap(({ tokens }) => tokens) : []
  const isLoadingInitialData = !data && !error
  const didReachEnd =
    data &&
    (data[data.length - 1]?.tokens?.length === 0 ||
      data[data.length - 1]?.continuation === null)

  if (!CHAIN_ID) return null

  const isInTheWrongNetwork = Boolean(signer && activeChain?.id !== +CHAIN_ID)

  return (
    <Masonry
      key="tokensGridMasonry"
      breakpointCols={{
        default: 6,
        2500: 7,
        1900: 5,
        1536: 4,
        1280: 4,
        1024: 3,
        768: 2,
        640: 2,
        500: 2,
      }}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {isLoadingInitialData
        ? Array(10)
            .fill(null)
            .map((_, index) => <LoadingCard key={`loading-card-${index}`} />)
        : mappedTokens?.map((token, idx) => {
            const isInCart = Boolean(
              tokensMap[`${token?.contract}:${token?.tokenId}`]
            )
            if (!token) return null
            return (
              <div
                key={`${token.contract}${token.tokenId}`}
                className="group bg-[url('/loading.gif')] bg-no-repeat bg-center relative self-start border-2 border-[#000000] transition ease-in hover:border-[#6d6d6d] hover:ease-out dark:bg-neutral-800 dark:ring-1 dark:ring-neutral-600"
              >
                {/* {isInCart ? (
                  <div className="absolute top-4 right-4 z-10 flex h-[34px] w-[34px] animate-slide-down items-center justify-center overflow-hidden rounded-full bg-primary-700">
                    <FaShoppingCart className="h-[18px] w-[18px] text-white" />
                  </div>
                ) : null} */}

                <Link
                  key={`${token?.collection?.name}${idx}`}
                  href={`/${token?.contract}/${token?.tokenId}`}
                >
                  
                  <a className="">
                  {token?.source && (
                    
                    <div className='absolute z-40 top-0 left-0 h-24 w-full bg-gradient-to-b from-black to-background-opacity-0 col-span-full font-pixeloid'>
                                        <div className='absolute top-4 left-4 h-8 w-8 font-pixeloid'>Available! 
  
                      </div>
                      </div>
                    )}
                    {token?.image ? (
                      <Image
                        loader={({ src }) => src}
                        src={optimizeImage(token?.image, 500)}
                        alt={`${token?.name}`}
                        className="absolute w-full h-full"
                        width={500}
                        height={500}
                        objectFit="cover"
                      />
                    ) : (
                      <div className="relative w-full">
                        <div className="absolute inset-0 grid place-items-center backdrop-blur-lg">
                          <div>
                            <img
                              src={optimizeImage(collectionImage, 250)}
                              alt={`${token?.collection?.name}`}
                              className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white"
                              width="64"
                              height="64"
                            />
                            <div className="reservoir-h6 text-white">
                              No Content Available
                            </div>
                          </div>
                        </div>
                        <img
                          src={optimizeImage(collectionImage, 250)}
                          alt={`${token?.collection?.name}`}
                          className="aspect-square w-full object-cover"
                          width="250"
                          height="250"
                        />
                      </div>
                    )}
                  <div className='absolute z-50 bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black col-span-full invisible group-hover:visible '>
                  <div className='absolute text-xs invisible group-hover:visible bottom-5 left-3 h-2 w-8 font-pixeloid'>
                  <ENSName address={token?.owner}></ENSName>
                  </div>
                  </div>
                  </a>
                </Link>
                {/* <div className="absolute -bottom-[41px] w-full  bg-white transition-all group-hover:bottom-[0px] dark:bg-neutral-800">
                  <div
                    className="reservoir-subtitle mb-3 overflow-hidden truncate px-4 pt-4 dark:text-white lg:pt-3"
                    title={token?.name || token?.tokenId}
                  >
                    {token?.name || `#${token?.tokenId}`}
                  </div>
                  <div className="flex items-center justify-between px-4 pb-4 lg:pb-3">
                    <div className="reservoir-h6">
                      <FormatEth amount={token?.floorAskPrice} logoWidth={7} />
                    </div>
                    <div className="text-right">
                      {token?.source && (
                        <img
                          className="h-6 w-6"
                          src={
                            SOURCE_ID &&
                            token?.source &&
                            SOURCE_ID === token?.source
                              ? SOURCE_ICON || NAVBAR_LOGO
                              : `https://api.reservoir.tools/redirect/logo/v1?source=${token?.source}`
                          }
                          alt=""
                        />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    {token &&
                      token.owner?.toLowerCase() !==
                        account?.address?.toLowerCase() && (
                        <BuyNow
                          data={{
                            token: token,
                          }}
                          signer={signer}
                          isInTheWrongNetwork={isInTheWrongNetwork}
                          buttonClassName="btn-primary-fill reservoir-subtitle flex h-[40px] items-center justify-center whitespace-nowrap rounded-none text-white focus:ring-0"
                        />
                      )}
                    {isInCart ? (
                      <button
                        onClick={() => {
                          const newCartTokens = [...cartTokens]
                          const index = newCartTokens.findIndex(
                            ({ contract, tokenId }) =>
                              contract === token?.contract &&
                              tokenId === token.tokenId
                          )
                          newCartTokens.splice(index, 1)
                          setCartTokens(newCartTokens)
                        }}
                        className="reservoir-subtitle flex h-[40px] items-center justify-center border-t border-neutral-300 text-[#FF3B3B] disabled:cursor-not-allowed dark:border-neutral-600 dark:text-red-300"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        disabled={!token?.floorAskPrice || isInTheWrongNetwork}
                        onClick={() => {
                          setCartTokens([...cartTokens, token])
                        }}
                        className="reservoir-subtitle flex h-[40px] items-center justify-center border-t border-neutral-300 disabled:cursor-not-allowed dark:border-neutral-600"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div> */}
              </div>
            )
          })}
      {!didReachEnd &&
        Array(10)
          .fill(null)
          .map((_, index) => {
            if (index === 0) {
              return (
                <LoadingCard viewRef={viewRef} key={`loading-card-${index}`} />
              )
            }
            return <LoadingCard key={`loading-card-${index}`} />
          })}
    </Masonry>
  )
}

export default TokensGrid
