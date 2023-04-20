import { FC, useEffect, useRef, useState } from 'react'
import { Welcome } from '@/components/welcome'
import { MessageCard } from '@/components/message-card'
import abort from '@/assets/img/abort.jpg'
import { IProps } from './props'
import styles from './index.module.css'
import { Message, MessageSocket } from '@/types'


const ws = new WebSocket('ws://localhost:5000')


export const SimpleChat: FC<IProps> = () => {

  const [isWelcome, setIsWelcome] = useState(true)
  const [isAbort, setIsAbort] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [surrogate, setSurrogate] = useState('000')
  const [surrogates, setSurrogates] = useState<string[]>([])
  const newMessage = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ws.addEventListener('message', (event) => {
      const mesSocket: MessageSocket = JSON.parse(event.data)

      switch (mesSocket.type) {
        case 'ADD_SURROGATE':
          setSurrogates([...(mesSocket.data as string[])])
          break
        case 'NEW_MESSAGE': {
          const newMes: Message = JSON.parse(mesSocket.data as string)
          console.log('gg', messages, newMes)
          
          if ( messages[0] === undefined || messages[0].date !== newMes.date) {
            setMessages((prev) => [newMes, ...prev])
          // } else if (messages[0] || messages[0].date !== newMes.date) {
          //   setMessages((prev) => [newMes, ...prev])
          }
          break
        }
      }
    })
  }, [])

  useEffect(() => {
    if (!isWelcome) {
      const mes = JSON.stringify({ type: 'ADD_SURROGATE', data: surrogate })
      ws.send(mes)
    }
  }, [isWelcome])


  const handleAbort = () => {
    setIsAbort(true)
  }

  const handleConnect = (name: string) => {
    setSurrogate(name)
    setIsWelcome(false)
  }

  const handleSendMessage = () => {
    if (newMessage.current && newMessage.current.value) {
      const newMes: Message = {
        author: surrogate,
        text: newMessage.current!.value,
        date: new Date()
      }

      const mes = JSON.stringify({ type: 'NEW_MESSAGE', data: newMes })
      ws.send(mes)
    }
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

  return (
    <div className={styles.centered}>
      <div className={styles.container}>
        <div className={styles.sub_container}>
          <div className={styles.mes_add}>
            <input ref={newMessage} className={styles.input_message} />
            <button onClick={handleSendMessage} className={styles.btn_add}>
              {' '}
              &#62;&#62;&#62;{' '}
            </button>
          </div>
          <div className={styles.list}>
            {messages.map((mes, index) => (
              <MessageCard key={index} text={mes.text} author={mes.author} date={mes.date} />
            ))}
          </div>
        </div>

        <div className={styles.mes_container}>
          <h2 className={styles.title}>Подключены к матрице</h2>
          <div className={styles.list}>
            {surrogates.map((surrogate, index) => (
              <div key={index}>{surrogate}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
