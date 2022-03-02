import { DefaultFooter } from '@ant-design/pro-layout';
import React from 'react';

const Footer: React.FC = () => {

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} rocketmq console ui`}
      links={[]
        }
    />
  );
};

export default Footer;
