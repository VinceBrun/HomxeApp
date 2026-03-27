import { OptionProps } from '@/types';
import React from 'react';
import OptionCard from './OptionCard';
// import Spacer from '@/components/ui/Spacer';

type Props = { optionsList: OptionProps[] };
const OptionList: React.FC<Props> = ({ optionsList }) => {
  return (
    <>
      {optionsList.map((option, index) => (
        <OptionCard
          option={option}
          key={option.title + index}
          isLast={index === optionsList.length - 1}
        />
      ))}
    </>
  );
};

export default OptionList;
