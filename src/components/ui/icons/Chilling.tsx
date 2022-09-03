import { animated, useSpring } from 'react-spring'

export default function Chilling({ isSelected }: { isSelected: boolean }) {
  const styles = useSpring({
    rotate: isSelected ? 10 : 0,
    x: 0,
    y: 0,
  })
  return (
    <animated.svg
      style={styles}
      className='w-16 mx-auto h-16'
      id='emoji'
      viewBox='0 0 72 72'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g id='color'>
        <circle cx='36' cy='36' r='23' fill='#FCEA2B' />
      </g>
      <g id='hair' />
      <g id='skin' />
      <g id='skin-shadow' />
      <g id='line'>
        <path
          fill='none'
          stroke='#000000'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeMiterlimit='10'
          strokeWidth='2'
          d='M41.6308,48.0192c-1.1233,1.2679-3.0497,2.0788-5.7815,2.0788c-2.7113,0-4.6397-0.8017-5.7749-2.0544'
        />
        <path
          fill='none'
          stroke='#000000'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeMiterlimit='10'
          strokeWidth='2'
          d='M21.1086,27.2015c0.7207-1.3857,1.9278-2.4541,3.3907-3c1.4052-0.7002,3.0205-0.8486,4.5302-0.4209'
        />
        <path
          fill='none'
          stroke='#000000'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeMiterlimit='10'
          strokeWidth='2'
          d='M50.719,27.2015c-1.582-2.7724-4.8037-4.1699-7.9092-3.4306'
        />
        <path
          fill='none'
          stroke='#000000'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeMiterlimit='10'
          strokeWidth='2'
          d='M23.4843,34.2452c0,0,3.9322-2.1695,8,0'
        />
        <path
          fill='none'
          stroke='#000000'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeMiterlimit='10'
          strokeWidth='2'
          d='M40.7343,34.2452c0,0,3.9322-2.1695,8,0'
        />
        <ellipse
          cx='36'
          cy='36'
          rx='23.0001'
          ry='23.0001'
          fill='none'
          stroke='#000000'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeMiterlimit='10'
          strokeWidth='2'
        />
      </g>
    </animated.svg>
  )
}
