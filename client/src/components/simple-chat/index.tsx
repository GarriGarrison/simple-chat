import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { Welcome } from '@/components/welcome'
import { MessageCard } from '@/components/message-card'
import abort from '@/assets/img/abort.jpg'
import { IProps } from './props'
import styles from './index.module.css'
import { EventsSocket, Message } from '@/types'

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
      const mesSocket: EventsSocket = JSON.parse(event.data)
      // console.log('mesSocket', mesSocket)

      switch (mesSocket.type) {
        case 'ADD_SURROGATE':
          setSurrogates([...mesSocket.data])
          break
        case 'GET_MESSAGE':
        case 'NEW_MESSAGE': {
          const mes: Message[] = JSON.parse(mesSocket.data)
          setMessages([...mes])
          break
        }
      }
    })

    return () => {
      ws.removeEventListener('message', () => {})
    }
  }, [])

  useEffect(() => {
    newMessage.current?.focus()
  }, [isWelcome])

  useEffect(() => {
    if (!isWelcome) {
      ws.onopen = () => {
        console.log('Соединение установлено')

        // const mes = {
        //   type: 'ADD_SURROGATE',
        //   data: {
        //     id: Date.now(),
        //     surrogate
        //   }
        // }

        // ws.send(mes)
      }

      //* 2-й способ обработки получения сообщения
      // ws.onmessage = (event) => {
      //   const mesSocket: EventsSocket = JSON.parse(event.data)
      //   // логика обработки
      // }

      ws.onclose = (event) => {
        if (event.wasClean) {
          console.log('Соединение закрыто чисто')
        } else {
          console.log('Обрыв соединения') // например, "убит" процесс сервера
        }
        console.log(`Код: ${event.code} причина: ${event.reason}`)
      }

      ws.onerror = (error) => {
        console.log(`Ошибка ${(error as ErrorEvent).message}`)
      }

      const mesConnect = JSON.stringify({ type: 'ADD_SURROGATE', data: surrogate })
      ws.send(mesConnect)

      const mesGetMessage = JSON.stringify({ type: 'GET_MESSAGE', data: null })
      ws.send(mesGetMessage)
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

      newMessage.current.value = ''
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage()
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
            <input ref={newMessage} onKeyDown={handleKeyDown} className={styles.input_message} />
            <button onClick={handleSendMessage} className={styles.btn_add}>
              {' '}
              &#62;&#62;&#62;{' '}
            </button>
          </div>
          <div className={styles.list}>
            {messages.map((mes) => (
              <div className={cn(styles.mes_wrapper, { [styles.mes_author]: mes.author === surrogate })}>
                <MessageCard key={mes.date.toLocaleString()} text={mes.text} author={mes.author} date={mes.date} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sub_container}>
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
