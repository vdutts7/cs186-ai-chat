import styles from '@/styles/loading-dots.module.css';

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