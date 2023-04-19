import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { Message } from '@/types'

export interface IProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, Message {
  children?: never
}
