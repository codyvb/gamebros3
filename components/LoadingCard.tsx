import { FC } from 'react'
import { useInView } from 'react-intersection-observer'

type Props = {
  viewRef?: ReturnType<typeof useInView>['ref']
}

const LoadingCard: FC<Props> = ({ viewRef }) => {
  return (
    <div
      ref={viewRef}
      className="grid min-h-[350px] w-full animate-pulse border border-neutral-300 bg-white shadow-md dark:border-neutral-600 dark:bg-neutral-900"
    >
    </div>
  )
}

export default LoadingCard
