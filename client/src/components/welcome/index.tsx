import { FC } from 'react'
import welcome from '@/assets/img/welcome.jpg'
import { IProps } from './props'


export const Welcome: FC<IProps> = ({ onAbort }) => (
  <div>
    <img src={welcome} alt="welcome" width="728px" height="409px" />
    <input />
    <button>Yes</button>
    <button onClick={onAbort}>No</button>
  </div>
)
