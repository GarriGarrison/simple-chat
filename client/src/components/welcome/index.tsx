import { ChangeEvent, FC, KeyboardEvent, useEffect, useRef, useState } from 'react'
import welcome from '@/assets/img/welcome.jpg'
import { IProps } from './props'
import styles from './index.module.css'


export const Welcome: FC<IProps> = ({ onAbort, onConnect }) => {

  const [name, setName] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)

  const inputRef = useRef<HTMLInputElement>(null)

  
  useEffect(() => {
    inputRef.current?.focus()
  },[])


  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    setIsDisabled(!event.target.value)
  }

  const handleConnect = () => {
    onConnect(name)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        handleConnect()
        break
      case 'Escape':
        onAbort()
        break
    }
  }

  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Кто Вы, мистер Андерсон?</h1>
      {name.length > 2 && <img src={welcome} alt="welcome" width="728px" height="409px" />}
      <input ref={inputRef} value={name} onChange={handleInput} onKeyDown={handleKeyDown} className={styles.input_name} />
      <button disabled={isDisabled} onClick={handleConnect} className={styles.btn_connect}>
        Yes
      </button>
      <button onClick={onAbort} className={styles.btn_abort}>
        No
      </button>
    </div>
  )
}
