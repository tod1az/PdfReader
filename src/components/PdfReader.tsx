'use client'
import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { MdOutlineZoomIn, MdOutlineZoomOut } from "react-icons/md";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import { useRouter, useSearchParams } from 'next/navigation';
import { ImCancelCircle } from "react-icons/im";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

export default function PdfReader() {

  const zoomSizes = [360, 480, 600, 720, 860]
  const router = useRouter()
  const [pdf, setPdf] = useState<File | string>(`./manga.pdf`)
  const searchParams = useSearchParams()
  const [numPages, setNumPages] = useState<number>(234);
  const [zoomIndex, setZoom] = useState(0)
  const [inputToggle, setInputToggle] = useState(false)


  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  }

  const next = (): void => {
    const currentPage = getCurrentPage()

    if (currentPage === numPages) return
    changePage(currentPage + 1)
  }

  const back = (): void => {
    const currentPage = getCurrentPage()
    if (currentPage === 1) return
    changePage(currentPage - 1)
  }

  const changePage = (page: number): void => {
    router.push(`?page=${page}`)
    window.localStorage.setItem('currentPage', String(page))
  }

  const zoomIn = (): void => {
    if (zoomIndex === zoomSizes.length - 1) {
      return
    } else {
      setZoom(zoomIndex + 1)
    }
  }

  const zoomOut = (): void => {
    if (zoomIndex === 0) {
      return
    } else {
      setZoom(zoomIndex - 1)
    }
  }

  const getCurrentPage = (): number => {
    const currentPage = searchParams.get('page')
    if (currentPage) {
      return Number(currentPage)
    } else {
      return 1
    }
  }

  const handleNewFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== null && e.target.files[0]) {
      setPdf(e.target.files[0])
      window.localStorage.setItem('page', '1')
      router.push('/')
      setInputToggle(!inputToggle)
    }
  }

  useEffect(() => {
    const currentPage = window.localStorage.getItem('currentPage')
    if (currentPage) {
      router.push(`?page=${currentPage}`)
    }
  }, [router])

  return (
    <div className='flex flex-col flex-1 h-max  justify-start items-center p-10'>
      <header className='flex gap-2 justify-between items-center mt-20 w-[330px] text-white'>
        <button onClick={back}>
          <FaArrowCircleLeft />
        </button>

        <button
          onClick={zoomOut}
          className='text-white text-2xl'>
          <MdOutlineZoomOut />
        </button>

        <button
          onClick={zoomIn}
          className='text-white text-2xl'>
          <MdOutlineZoomIn />
        </button>

        <button
          onClick={next}
        >
          <FaArrowCircleRight />
        </button>
      </header>
      <main
        className={`p-2 mt-2 bg-gray-600 rounded-lg`}
        onClick={next}
      >
        <Document
          file={pdf}
          onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={getCurrentPage()}
            width={zoomSizes[zoomIndex]}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </main>
      <footer className='mt-20 text-white transition-all'>

        {
          inputToggle
            ? (
              <div className='flex items-center justify-between gap-2'>
                <input type="file" accept='.pdf' onChange={handleNewFile} />
                <button
                  onClick={() => setInputToggle(!inputToggle)}
                >
                  <ImCancelCircle />
                </button>
              </div>
            )
            : (<button
              onClick={() => setInputToggle(!inputToggle)}
              className='border px-3 py-1 rounded-lg'>
              Cambiar de archivo
            </button>)
        }
      </footer>
    </div>
  );
}