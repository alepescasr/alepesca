interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
  children
}) => {
  return ( 
    <div className="mx-auto max-full">
      {children}
    </div>
   );
};

export default Container;
