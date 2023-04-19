import { FC } from 'react'
import { IProps } from './props'
import styles from './index.module.css'


export const MessageCard: FC<IProps> = ({ text, author, date }) => (
  <div className={styles.container}>
    <div>{author}</div>
    <div className={styles.text}>{text}</div>
    <div className={styles.meta}>{date.toLocaleString()}</div>
  </div>
)
