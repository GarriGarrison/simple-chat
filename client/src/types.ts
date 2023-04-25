export type Message = {
  author: string
  text: string
  date: Date
}

export type Surrogate = {
  id: string
  name: string
}


type SurrogateSocket = {
  type: 'ADD_SURROGATE'
  data: string
}

type MessageSocket = {
  type: 'GET_MESSAGE' | 'NEW_MESSAGE'
  data: string
}

export type EventsSocket = SurrogateSocket | MessageSocket
