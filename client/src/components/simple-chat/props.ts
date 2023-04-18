import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface IProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: never
}
