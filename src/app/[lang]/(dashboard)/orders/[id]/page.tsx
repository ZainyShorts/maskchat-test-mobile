import PrintOrder from '@/components/PrintOrder'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function Page({ params }: PageProps) {
  
  return (
    <>
      <PrintOrder id={params.id} />
    </>
  )
}
