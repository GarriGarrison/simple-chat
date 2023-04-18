import { ChangeEvent, FC, useState } from 'react'
import welcome from '@/assets/img/welcome.jpg'
import { IProps } from './props'


export const Welcome: FC<IProps> = ({ onAbort, onConnect }) => {

  const [name, setName] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)


  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    setIsDisabled(!event.target.value)
  }

  const handleConnect = () => {
    onConnect(name)
  }


  return (
    <div>
      <img src={welcome} alt="welcome" width="728px" height="409px" />
      <input value={name} onChange={handleInput} />
      <button disabled={isDisabled} onClick={handleConnect}>Yes</button>
      <button onClick={onAbort}>No</button>
    </div>
  )
}
