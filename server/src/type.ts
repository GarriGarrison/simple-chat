export type Message = {
  author: string;
  text: string;
  date: Date;
};


type SurrogateSocket = {
  type: 'ADD_SURROGATE';
  data: string;
};

type MessageSocket = {
  type: 'GET_MESSAGE' | 'NEW_MESSAGE';
  data: Message;
};

export type EventsSocket = SurrogateSocket | MessageSocket;

