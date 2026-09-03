const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve().catch(error => next(error))
    }
}

export {asyncHandler}