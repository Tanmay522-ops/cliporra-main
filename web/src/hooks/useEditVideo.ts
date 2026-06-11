import useZodForm from './useZodForm'
import { useMutationData } from './useMutationData'
import { editVideoInfo } from '@/actions/workspace'
import { editVideoInfoSchema } from '@/components/global/forms/edit-video/schema'
import { useEffect } from 'react'

export const useEditVideo = (
    videoId: string,
    title: string,
    description: string,
) => {
    const { mutate, isPending } = useMutationData(
        ['edit-video'],
        (data: { title: string; description: string }) =>
            editVideoInfo(videoId, data.title, data.description),
        'preview-video'
    )

    const { errors, onFormSubmit, register,reset } = useZodForm(
        editVideoInfoSchema,
        mutate,
        {
            title,
            description,
        }
    )

    
    return {onFormSubmit, errors,  register, isPending, reset}
}