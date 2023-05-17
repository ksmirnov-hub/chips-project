import React, {useEffect} from 'react';
import Chips from './Chips';
import ReactDomServer from 'react-dom/server';
import Modal from 'react-modal';
import uniq from 'lodash/uniq';

const CHIPS_NUMBER = 13;
const SELECTED_COLOR = '#FF2525';
const ORDINARY_COLOR = 'rgb(226 232 240)';

const chipsArray = Array.from(Array(CHIPS_NUMBER).keys());
let hiddenElements: string[] = [];
let selectedElement: string = '';

const customStyles = {
    content: {
      top: '20%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

function Main() {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const hasWindow = typeof window !== 'undefined';
    const listBlock = React.useRef<any>(null);

    const openModal = () => {
        setModalIsOpen(true);
    }
    const closeModal = () => {
        setModalIsOpen(false);
    }

    const handleResize = () => {
        listBlock.current.innerHTML = ReactDomServer.renderToString(renderChips());
        const list = Array.from(listBlock.current.children);
        hiddenElements = [];
        list.map((item: any) => {
            if (item.id !== 'popup') {
                item.addEventListener('click', function (event: React.MouseEvent<HTMLDivElement>) {
                    handleEvent(event);
                });
                const left = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
                const itemLeft = window.pageXOffset + item.getBoundingClientRect().right + 80;
    
                if (itemLeft === 0 || itemLeft > left) {
                    hiddenElements.push(item.id)
                     item.style.display = 'none';
                }
            } else {
                item.addEventListener('click', function (event: React.MouseEvent<HTMLDivElement>) {
                    openModal()
                });
            }
            return null;
        })
        console.log('hiddenElements', hiddenElements)
      }
    
    useEffect(() => {
        if (hasWindow) {
            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }
      }, [hasWindow, listBlock, handleResize]);

    const handleEvent = (event: React.MouseEvent<HTMLDivElement>) => {
        const selected = document.getElementById(selectedElement) || document.createElement('div');
        selected.style.backgroundColor = ORDINARY_COLOR;

        if (event.target instanceof HTMLElement) {
            if (selectedElement === event.target.id) {
                return;
            } else {
                selectedElement = event.target.id;
                event.target.style.backgroundColor = SELECTED_COLOR;
            }
        }
    }

    const renderChips: () => any = () => {
       return (
            <>
                    {
                        chipsArray.map((item, index) => {
                            return <Chips title={`Чипс ${item + 1}`} handleClick={(e) => handleEvent(e)} index={String(index)} />
                        })
                    }
                    {
                        hiddenElements.length ? (
                            <Chips title={'...'} index={'popup'} />
                        ) : null
                    } 
            </>
       )
    }

    return (
        <div id="list" ref={listBlock} className='h-full w-full flex overflow-hidden mt-[30px]'>
            {
                renderChips()
            }
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
        >
            <div className='h-auto w-full flex justify-end mb-[10px]'>
                <button onClick={closeModal}>Закрыть</button>
            </div>
            {
                <div className='h-full w-full flex flex-wrap'>
                    {
                        uniq(hiddenElements).map((item, index) => {
                            const number = Number(item) + 1;
                            return <Chips title={`Чипс ${number}`} index={String(index)} />
                        })
                    }
                </div>

            }
        </Modal>
        </div>
    )
}

export default Main;