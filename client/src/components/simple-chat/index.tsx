import { FC, useState } from 'react'
import { Welcome } from '@/components/welcome'
import styles from './index.module.css'


export const SimpleChat: FC = () => {

  const [isWelcome, setIsWelcome] = useState(true)


  if (isWelcome) {
    return (
      <div className={styles.centered}>
        <Welcome />
      </div>
    )
  }

  return <div>CHAT</div>
}
