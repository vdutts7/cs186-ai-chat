import styles from '@/styles/loading-dots.module.css';
import ReactDOM from 'react-dom';
import Scheduler from 'scheduler';

const LoadingDots = ({
  style = 'small', color = '#000000', }: 
{ style: string; color: string; }) => {
  return (
    <span className={style == 'small' ? styles.loading2 : styles.loading}>
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  );
};

export default LoadingDots;
LoadingDots.defaultProps = {
  style: 'small',
};