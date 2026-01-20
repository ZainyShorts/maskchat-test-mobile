import OrderPreviewDetails from './OrderPreviewDetails'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function Page({ params }: PageProps) {
  return (
    <>
      <OrderPreviewDetails id={params.id} />
    </>
  )
}
