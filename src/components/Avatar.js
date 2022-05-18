import React from 'react'
import styles from '../styles/Avatar.module.css'

// Below, instead of props, values were added as props directly
// more about destructuring: https://zaiste.net/posts/javascript-destructuring-assignment-default-values
const Avatar = ({ src, height = 45, text }) => {
    return (
      <span>
        <img
          className={styles.Avatar}
          src={src}
          height={height}
          width={height}
          alt="avatar"
        />
        {text}
      </span>
    );
  };
  
  export default Avatar;