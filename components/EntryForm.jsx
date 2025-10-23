"use client"
import { entrySchema, resumeSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import { CirclePlus, Loader2, PlusCircle, Sparkle, X } from 'lucide-react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from './ui/input'
import { improvewithai } from '@/actions/resume'
import useFetch from './hooks/use-fetch'
import { toast } from 'sonner'
import { Textarea } from './ui/textarea'
import { format, parse } from 'date-fns'

const formatdisplaydt = (datastring) => {
    if (!datastring) return "";
    const date = parse(datastring, "yyyy-MM", new Date());
    return format(date, "MMM yyyy");
}

const EntryForm = ({ type, entries, onChange }) => {
    const [isadding, setisadding] = useState(false);
    const {
        control,
        register,
        handleSubmit: handleValidation,
        watch,
        reset,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            title: "",
            current: false,
            description: "",
            Organization: "",
            startDate: "",
            endDate: "",

        }
    });



    const current = watch("current");
    const {
        loading: isImproving,
        fn: improvefn,
        data: improvedContent,
        error: improveError,
    } = useFetch(improvewithai);

    useEffect(() => {
        if (improvedContent && !isImproving) {
            setValue("description", improvedContent);
            toast.success("Description has been enhanced")

            if (improveError) {
                toast.error("Failed to enhance Description")
            }
        }
    }, [improvedContent, improveError, isImproving])

    // const handleAdd = handleValidation((data) => {
    //     const formatteddata = {
    //         ...data,
    //         startDate: formatdisplaydt(data.startDate),
    //         endDate: data.current ? "" : formatdisplaydt(data.endDate),
    //     }

    //     onChange([...entries, formatteddata]);

    // })

    const handleAdd = () => {
        const data = watch(); // get current form values

        // Minimal required fields check
        if (!data.title || !data.Organization || !data.startDate || !data.description) {
            toast.error("Please fill all required fields");
            return;
        }

        // End date check only if not current
        if (!data.current && !data.endDate) {
            toast.error("End Date is required unless it is your current position");
            return;
        }

        // Format dates
        const formattedData = {
            ...data,
            startDate: formatdisplaydt(data.startDate),
            endDate: data.current ? "" : formatdisplaydt(data.endDate),
        };

        // Add the entry
        onChange([...entries, formattedData]);

        // Reset form & hide
        reset();
        setisadding(false);
    };
    const handleDelete = (index) => {

        const newEntries = entries.filter((_, i) => i != index);
        onChange(newEntries)
    }
    const handleImproveDescription = async () => {
        const description = watch("description");
        if (!description) {
            toast.error("Please enter description")
            return;
        }
        await improvefn({
            current: description,
            type: type.toLowerCase(),
        })
    }
    return (
        <div>

            <div className='space-y-4'>
                {
                    entries.map((item, index) => {
                        return (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle>
                                        {item.title} @ {item.Organization}
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        type="button"
                                        onClick={() => handleDelete(index)}
                                    >
                                        <X className='h-3 w-3' />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        {item.current
                                            ? `${item.startDate} - Present`
                                            : `${item.startDate} - ${item.endDate}`
                                        }
                                    </p>
                                    <p>{item.description}</p>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </div>
            {
                isadding && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Add {type}</CardTitle>
                        </CardHeader>
                        <CardContent className={"space-y-4"}>
                            <div className='grid grid-cols-2 gap-2'>
                                <div className='space-y-3'>
                                    <Input
                                        {...register("title")}
                                        placeholder="Title/Position"
                                        errors={errors.title}
                                    />
                                    {
                                        errors.title && (
                                            <p className="text-red-500 text-sm">
                                                {errors.title.message}
                                            </p>
                                        )
                                    }
                                </div>
                                <div className='space-y-3'>
                                    <Input
                                        {...register("Organization")}
                                        placeholder="Organisation / Company"
                                        errors={errors.Organization}
                                    />
                                    {
                                        errors.Organization && (
                                            <p className="text-red-500 text-sm">
                                                {errors.Organization.message}
                                            </p>
                                        )
                                    }
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Input
                                        type="month"
                                        {...register("startDate")}
                                        errors={errors.startDate}
                                    />
                                    {
                                        errors.startDate && (
                                            <p className="text-red-500 text-sm">
                                                {errors.startDate.message}
                                            </p>
                                        )
                                    }
                                </div>
                                <div className='space-y-2'>
                                    <Input
                                        type="month"
                                        {...register("endDate")}
                                        errors={errors.endDate}
                                        disabled={current}
                                    />
                                    {
                                        errors.endDate && (
                                            <p className="text-red-500 text-sm">
                                                {errors.endDate.message}
                                            </p>
                                        )
                                    }
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <input
                                    type="checkbox"
                                    id="current"
                                    {...register("current")}
                                    onChange={(e) => {
                                        setValue("current", e.target.checked)
                                        if (e.target.checked) {
                                            setValue("endDate", "");
                                        }
                                    }}

                                />
                                <label htmlFor="">Current </label>
                            </div>
                            <div className='space-y-2'>
                                <Textarea
                                    {...register("description")}
                                    errors={errors.description}
                                    placeholder={`write your description for ${type} here`}
                                />
                                {
                                    errors.description && (
                                        <p className="text-red-500 text-sm">
                                            {errors.description.message}
                                        </p>
                                    )
                                }
                            </div>
                            <Button
                                type="button"
                                variant={"ghost"}
                                size="sm"
                                onClick={handleImproveDescription}
                                disabled={isImproving || !watch("description")}
                            >
                                {isImproving ? (
                                    <>
                                        <Loader2 className='h-3 animate-spin' />
                                        Improving...
                                    </>
                                ) : (
                                    <>
                                        <Sparkle className='h-3' />
                                        Improve with AI
                                    </>
                                )}
                            </Button>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    reset();
                                    setisadding(false)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button" onClick={handleAdd}
                            >
                                <CirclePlus className='h-4 w-4' />
                                Add
                            </Button>
                        </CardFooter>
                    </Card>
                )
            }
            {
                !isadding && (
                    <Button
                        variant={"outline"}
                        onClick={() => setisadding(true)}>
                        <PlusCircle className='w-5 h-5 mr-4' />
                        Add {type}
                    </Button>
                )
            }
        </div>
    )
}

export default EntryForm
