export type Message = {
  author: string
  text: string
  date: Date
}

export type Surrogate = {
  id: string
  name: string
}

export type MessageSocket = {
  type: string
  data: string | string[] | Message
}
