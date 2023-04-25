export type Message = {
  author: string;
  text: string;
  date: Date;
};

export type Surrogate = {
  id: string;
  name: string;
};


type SurrogateSocket = {
  type: 'ADD_SURROGATE';
  data: Surrogate;
};

type MessageSocket = {
  type: 'GET_MESSAGE' | 'NEW_MESSAGE';
  data: Message;
};

export type EventsSocket = SurrogateSocket | MessageSocket;

