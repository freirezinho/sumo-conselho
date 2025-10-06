import {default as TempleIcon} from '../../assets/SP_Temple_Icon.svg'

export const NavBar = () => {
  return (
    <nav className='w-full p-4 text-white bg-stb-blue-20'>
      <div className='flex items-center gap-2'>
        <img src={TempleIcon}  className='h-10 w-10'/>
        <div>
          <p>Sumo Conselho</p>
          <p>Estaca SP Brasil Raposo Tavares</p>
        </div>
      </div>
    </nav>
  )
}