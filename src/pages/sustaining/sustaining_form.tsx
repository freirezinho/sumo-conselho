import { useEffect, useState } from "react";
import useRemoteConfig from "../../hooks/use_remote_config";
import { useUserId } from "../../hooks/use_user_id";
import { printDebug } from "../../utils/print_debug";
import { useNavigate } from "react-router";
import { useCache } from "../../hooks/use_cache";
import { NavBar } from "../../common/navbar/navbar";
import { SustainingFormRow } from "./sustaining_form_row";

export const SustainingForm = () => {
  const {userName, userId, getIsPresidingOfficer, getPresidencyCall} = useUserId();
  const rcCallingsData = useRemoteConfig('sustaining_recommendations') 
  printDebug("Callings data retrieved from firebase:", rcCallingsData);
  const [callings, setCallings] = useState<{[key: string]: string|boolean|number|null}[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const cache = useCache();
  const CURRENT_SUSTAINING_TOKEN = useRemoteConfig('current_sustaining_token')
  
  printDebug("Current sustaining token retrieved from firebase:", CURRENT_SUSTAINING_TOKEN);

  useEffect(() => {
    let parsedData;
    if (rcCallingsData) {
      try {
        parsedData = JSON.parse(rcCallingsData as string);
      } catch (error) {
        parsedData = { data: [] };
        if (import.meta.env.DEV) {
          console.error("Error parsing callings data from remote config, using local data instead:", error);
        }
      }
    } else {
      printDebug("No remote config data found, using local data.");
      parsedData = { data: [] };
    }

    const initialCallings = parsedData.data.map((calling: {calling: string, name: string, unit: string, situation: string, support: string|null}, index: number) => ({
      id: index,
      calling: calling.calling,
      name: calling.name,
      unit: calling.unit,
      situation: calling.situation,
      support: null
    }));
    setCallings(initialCallings);
  }, [rcCallingsData]);

  const handleRowUpdate = (id: number, support: boolean) => {
    setCallings(prevCallings => prevCallings.map(calling => {
      if (calling.id === id) {
        return { ...calling, support };
      }
      return calling;
    }));
  }


  /**
   * Handles the submission of voting results for callings.
   * 
   * Prevents the default form submission behavior, checks if all callings have been voted on,
   * and alerts the user if any are still pending. If all votes are complete, transforms the
   * callings array into an array of objects with formatted keys and vote values, adds user information,
   * logs the result, and displays a thank you alert.
   *
   * @param e - The mouse event triggered by the submit action.
   */
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    const isPending = !callings.every(calling => calling.support !== null)
    printDebug(isPending ? "Some callings are still pending." : "All callings have been voted on.")
    if (isPending) {
      setErrorMessage("Por favor, responda a todos os chamados antes de enviar.");
      return;
    }
    const result = callings.map(calling => ({
      action: `${calling.situation === 'new' ? 'Chamar' : 'Desobrigar'}: ${calling.calling} - ${calling.name} (${calling.unit})`,
      supports: calling.support ? "Sim" : "Não",
      sentBy: userName,
      userId: userId
    }));

    const apiURL = "https://script.google.com/macros/s/AKfycbweVbutD3C3R3KxNv-hddUzXvleWaRGHCiBvaLWykMjRW9Q41-1rZ3gxeGEBg5_u-W9/exec"
    setIsRequesting(true);
    setErrorMessage("");
    fetch(`${apiURL}?v=${new Date().getTime()}`, {
      method: "POST",
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(result),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      if (data.result === 'success') {
      printDebug('Success!', data)
      cache.cacheData(CURRENT_SUSTAINING_TOKEN as string, true)
      .then(() => {
          printDebug("Token cached successfully.")
      })
      .catch(err => { 
          if (import.meta.env.DEV) {
             console.error("Error caching token:", err)
            }
      })
      .finally(() => navigate("/obrigado"));
    } else {
      setErrorMessage("Ocorreu um erro ao enviar suas respostas. Por favor, tente novamente mais tarde.");
      throw new Error(data.error || 'Unknown error occurred');
    }
    })
    .catch((error) => {
      if (import.meta.env.DEV) {
        setErrorMessage("Erro ao enviar suas respostas. Por favor, tente novamente mais tarde.");
        console.error("Error:", error);
      }
    })
    .finally(() => { setIsRequesting(false); });
  }

  cache.getCachedData(CURRENT_SUSTAINING_TOKEN as string).then(data => {
    if (data) {
      printDebug("Cached token found:", data);
      if (data === true) {
        printDebug("Token is valid.")
        navigate("/obrigado");
      } else {
        printDebug("Token is invalid.");
      }
    } else {
      printDebug("No cached token found.");
    }
  });

  return (
    <section className='h-screen pb-2 flex flex-col items-center'>
    <NavBar />
    <main className='mt-2 flex flex-col justify-center items-center'>
        <div className='mx-auto flex flex-col max-w-3xl px-12 py-12 rounded-2xl card bg-white'>
          <header className='mb-4'>
          <h1 className='text-3xl text-stb-yellow-30'>Olá, { getIsPresidingOfficer() ? 'Pres.': 'Irmão'} {userName}</h1>
          <p className='opacity-50'>{getPresidencyCall(userId || "") || 'Membro do Sumo Conselho'}</p>
          <p className='uppercase opacity-50'>Estaca São Paulo Brasil Raposo Tavares</p>
        </header>
        {getIsPresidingOfficer() && (
          <div className=''>
            <p className='text-sm'>Obrigado por seu interesse no apoio do Sumo Conselho. Os membros do Sumo Conselho da Estaca sentem-se honrados em servir com você e poder apoiar as desições de sua presidência. Ainda não temos um acompanhamento dos votos do sumo conselho pelo site. Por favor, peça ao Saulo o link da planilha onde os votos são registrados.</p>
          </div>
        )}
        {!getIsPresidingOfficer() && (
          <>
            <p className='mb-4'>Pedimos seu apoio para estender os chamados a seguir aos seguintes irmãos e irmãs.
          A aprovação eletrônica unânime substitui a aprovação em reunião.</p>
        { callings.filter(calling => calling.situation === 'release').length > 0 && (
          <>
            <h2 className='text-2xl'>Desobrigações</h2>
            <div className='table py-4 border-separate border-spacing-y-2'>
              <div className="table-header-group ...">
                <div className="table-row font-bold">
                  <div className="table-cell">Nome</div>
                  <div className="table-cell mr-2">Sim</div>
                  <div className="table-cell ml-2">Não</div>
                </div>
              </div>
              {
                callings.filter(calling => calling.situation === 'release').map((calling, index) => (
                  <SustainingFormRow
                    key={`${index}+${calling.name}`}
                    id={calling.id as number}
                    calling={calling.calling as string}
                    name={calling.name as string}
                    unit={calling.unit as string}
                    onChange={handleRowUpdate}
                  />
                ))
              }
            </div>
          </>
        )}

        { callings.filter(calling => calling.situation === 'new').length > 0 && (
          <>
            <h2 className='text-2xl'>Chamados</h2>
            <div className='table py-4 border-separate border-spacing-y-2'>
              <div className="table-header-group ...">
                <div className="table-row font-bold">
                  <div className="table-cell">Nome</div>
                  <div className="table-cell">Sim</div>
                  <div className="table-cell">Não</div>
                </div>
              </div>
              {
                callings.filter(calling => calling.situation === 'new').map((calling, index) => (
                  <SustainingFormRow
                    key={`${index}+${calling.name}`}
                    id={calling.id as number}
                    calling={calling.calling as string}
                    name={calling.name as string}
                    unit={calling.unit as string}
                    onChange={handleRowUpdate}
                  />
                ))
              }
            </div>
          </>
        )}
        {errorMessage && <p className='text-red-500 text-sm mt-2'>{errorMessage}</p>}
          <div className='flex lg:justify-end'>
            <button
              className='rounded-md h-12 mt-8 transition-all bg-stb-blue-20 hover:bg-stb-blue-40 text-white w-full lg:w-32'
              onClick={handleSubmit}
              disabled={isRequesting}
            >
                {isRequesting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
          </>
        )}
        </div>
      </main>
  </section>
  )
}