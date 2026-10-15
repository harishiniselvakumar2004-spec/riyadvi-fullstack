import { Link } from 'react-router-dom';
import Magnetic from './Magnetic';

const VARIANTS = { primary: 'btn btn-primary', ghost: 'btn btn-ghost' };

/** Renders <Link>, <a> or <button> depending on props. Wrapped in a magnetic hover effect. */
export default function Button({ to, href, variant = 'primary', className = '', children, magnetic = true, ...rest }) {
  const cls = `${VARIANTS[variant]} ${className}`;
  let el;
  if (to) el = <Link to={to} className={cls} {...rest}>{children}</Link>;
  else if (href) el = <a href={href} className={cls} target="_blank" rel="noreferrer" {...rest}>{children}</a>;
  else el = <button className={cls} {...rest}>{children}</button>;
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
