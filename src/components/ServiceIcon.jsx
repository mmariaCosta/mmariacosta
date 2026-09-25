import {
  FaShieldHalved, FaBug, FaServer, FaCode,
  FaUserGraduate, FaCloud,
} from 'react-icons/fa6';

const ICONS = {
  shield:     FaShieldHalved,
  bug:        FaBug,
  server:     FaServer,
  code:       FaCode,
  graduation: FaUserGraduate,
  cloud:      FaCloud,
};

export default function ServiceIcon({ name, ...props }) {
  const Icon = ICONS[name] || FaShieldHalved;
  return <Icon {...props} />;
}