import { useEditVideo } from '@/hooks/useEditVideo'
import { FormGenerator } from '../../form-generator'
import Loader from '../../loader'
import { Button } from '@/components/ui/button'


type Props = {
    videoId: string
    title: string
    description: string
}

const EditVideoForm = ({ description, title, videoId }: Props) => {
    const { errors, isPending, onFormSubmit, register } = useEditVideo(
        videoId,
        title,
        description
    )

    return (
        <form
            onSubmit={onFormSubmit}
            className="flex flex-col gap-y-5"
        >
            <FormGenerator
                register={register}
                errors={errors}
                name="title"
                inputType="input"
                type="text"
                placeholder={'Video Title...'}
                label="Title"
            />
            <FormGenerator
                register={register}
                label="Description"
                errors={errors}
                name="description"
                inputType="textarea"
                type="text"
                lines={5}
                placeholder={'Video Description...'}
            />
            <Button
                type="submit"
                className="w-full"
                disabled={isPending}
            >
                 <Loader className="animate-spin"  loading={false}/>
                 Update
            </Button>
        </form>
    )
}

export default EditVideoForm