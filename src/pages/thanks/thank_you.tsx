import { NavBar } from "../../common/navbar/navbar";
import { useUserId } from "../../hooks/use_user_id";

export const ThankYou = () => {
  const {userName} = useUserId();
   return (
   <section className='h-screen pb-2 flex flex-col items-center'>
    <NavBar />
    <main className='mt-2 px-6 h-full flex flex-col justify-center items-center'>
      <div className='mx-auto flex flex-col max-w-2xl px-12 py-12 rounded-2xl card bg-white'>
        <header className='mb-4'>
          <h1 className='text-3xl text-stb-yellow-30'>Apoios do Sumo Conselho</h1>
          <p className='uppercase opacity-20'>Estaca São Paulo Brasil Raposo Tavares</p>
        </header>
        <h2 className='text-2xl mb-4'>Muito obrigado!</h2>
        <p>A Presidência da Estaca agradece por seu apoio e seu serviço dedicado, {userName.split(" ")[0]}.</p>
        <p>Caso tenha algum desconforto com alguma recomendação de chamado ou desobrigação, por favor, procure um membro da presidência e expresse suas preocupações.</p>
      </div>
    </main>
  </section>
  )}