import { FC, useState } from 'react'
import { Welcome } from '@/components/welcome'
import abort from '@/assets/img/abort.jpg'
import { IProps } from './props'
import styles from './index.module.css'


export const SimpleChat: FC<IProps> = () => {

  const [isWelcome, setIsWelcome] = useState(true)
  const [isAbort, setIsAbort] = useState(false)


  const handleAbort = () => {
    setIsAbort(true)
  }

  const handleConnect = (name: string) => {
    console.log('name', name)  //* debug
    setIsWelcome(false)
  }


  if (isAbort) {
    return <img src={abort} alt="abort" width="100%" height="99%" />
  }

  if (isWelcome) {
    return (
      <div className={styles.centered}>
        <Welcome onAbort={handleAbort} onConnect={handleConnect} />
      </div>
    )
  }

  return <div>CHAT</div>
}
