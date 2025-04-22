import Image from 'next/image';
// import loader from '/loader.gif';

const LoadingPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Image src={`/loader.gif`} height={150} width={150} alt='Loading...' />
    </div>
  );
};

export default LoadingPage;
