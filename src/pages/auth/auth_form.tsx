import { useRef, useState } from "react";
import { useUserId } from "../../hooks/use_user_id";
import { useNavigate } from "react-router";
import { NavBar } from "../../common/navbar/navbar";

export const AuthForm = () => {

  const { setUserId, highCouncilMembers } = useUserId()
  const [firstDigit, setFirstDigit] = useState("");
  const [secondDigit, setSecondDigit] = useState("");
  const [thirdDigit, setThirdDigit] = useState("");
  const [, setFourthDigit] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const firstDigitRef  = useRef<HTMLInputElement>(null);
  const secondDigitRef = useRef<HTMLInputElement>(null)
  const thirdDigitRef = useRef<HTMLInputElement>(null)
  const fourthDigitRef = useRef<HTMLInputElement>(null)
  

  const isValidCode = (code: string) => {
    if (code.length !== 4) { 
      return false;
    }

    const codeMap = new Map<string, string>(Object.entries(highCouncilMembers));

    if (codeMap.has(code)) {
      return true;
    }

    return false
  }

  const onFocusDigit = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    input.value = "";
  }

  const onChangeDigit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const maxLength = 1;
    if (input.value.length >= maxLength) {
      switch (input) {
        case firstDigitRef.current:
          setFirstDigit(input.value);
          secondDigitRef.current?.focus();
          if (secondDigitRef.current) {
            secondDigitRef.current.value = "";
          }
          break;
        case secondDigitRef.current:
          setSecondDigit(input.value);
          thirdDigitRef.current?.focus();
          if (thirdDigitRef.current) {
            thirdDigitRef.current.value = "";
          }
          break;
        case thirdDigitRef.current:
          setThirdDigit(input.value);
          fourthDigitRef.current?.focus();
          if (fourthDigitRef.current) {
            fourthDigitRef.current.value = "";
          }
          break;
        case fourthDigitRef.current:
          setFourthDigit(input.value);
          fourthDigitRef.current?.blur();
          if (isValidCode(firstDigit + secondDigit + thirdDigit + input.value)) {
            setErrorMessage("")
            setUserId(firstDigit + secondDigit + thirdDigit + input.value);
            navigate("/apoios");
          } else {
            setErrorMessage("Código inválido. Por favor, tente novamente ou procure o secretário executivo.");
            if (firstDigitRef.current) {
              firstDigitRef.current.value = "";
              firstDigitRef.current.focus();
            }
            if (secondDigitRef.current) {
              secondDigitRef.current.value = "";
            }
            if (thirdDigitRef.current) {
              thirdDigitRef.current.value = "";
            }
            if (fourthDigitRef.current) {
              fourthDigitRef.current.value = "";
            }
            setFirstDigit("");
            setSecondDigit("");
            setThirdDigit("");
            setFourthDigit("");
          }
          break;
        default:
          break;
      }
    }
  }

   return (
   <section className='h-screen pb-2 flex flex-col justify-between items-center'>
    <NavBar />
    <main className='h-full flex flex-col justify-center items-center px-8'>
      <div className='mx-auto flex flex-col max-w-2xl px-12 py-12 rounded-2xl card bg-white'>
      <header className='mb-4'>
        <h1 className='text-3xl text-stb-yellow-30'>Apoios do Sumo Conselho</h1>
        <p className='uppercase opacity-20'>Estaca São Paulo Brasil Raposo Tavares</p>
      </header>
      <label htmlFor='memberNo1' className='text-dark-charcoal'>Digite os 4 últimos dígitos do seu número de membro para continuar</label>
      <div className='flex gap-4 mx-auto py-4 mt-4'>
        <input type="text" name='memberNo1' className='border-b border-stb-yellow-10 w-12 h-12 text-center' ref={firstDigitRef} onChange={onChangeDigit} onFocus={onFocusDigit}/>
        <input type="text" name='memberNo2' className='border-b border-stb-yellow-10 w-12 h-12 text-center' ref={secondDigitRef} onChange={onChangeDigit} />
        <input type="text" name='memberNo3' className='border-b border-stb-yellow-10 w-12 h-12 text-center' ref={thirdDigitRef} onChange={onChangeDigit} />
        <input type="text" name='memberNo4' className='border-b border-stb-yellow-10 w-12 h-12 text-center' ref={fourthDigitRef} onChange={onChangeDigit} />
      </div>
      {errorMessage && <p className='text-red-500 text-sm mt-2'>{errorMessage}</p>}
      <button className='rounded-md h-12 mt-8 transition-all bg-stb-blue-20 hover:bg-stb-blue-40 text-white'>Continuar</button>
      </div>
    </main>
  </section>
  )
};