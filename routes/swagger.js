/**
 * @swagger
 *  /users:
 *    get:
 *      summary: get all users
 *      responses:
 *        200:
 *          description: successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  users:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: the id user (Auto generate)
 *                           example: d4f439e4-e936-48a0-94a7-13d1eab9de8e
 *                         name:
 *                           type: string
 *                           description: the name user (Auto generate)
 *                           example: jamshid
 *                         email:
 *                           type: string
 *                           description: the email user (Auto generate)
 *                           example: jamshid@gmail.com
 *                         photo:
 *                           type: string
 *                           description: the photo user
 *                           example: example.jpg
 *                         passwordChangedDate:
 *                           type: date
 *                           description: user was created date
 *                           example: 2023-07-07T11:41:51.543Z
 *        404:
 *          description: Not found
 */


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: get user with user id
 *     description: Returns single pet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *          description: user
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                         id:
 *                           type: string
 *                           description: the id user (Auto generate)
 *                           example: d4f439e4-e936-48a0-94a7-13d1eab9de8e
 *                         name:
 *                           type: string
 *                           description: the name user (Auto generate)
 *                           example: jamshid
 *                         email:
 *                           type: string
 *                           description: the email user (Auto generate)
 *                           example: jamshid@gmail.com
 *                         photo:
 *                           type: string
 *                           description: the photo user
 *                           example: example.jpg
 *                         passwordChangedDate:
 *                           type: date
 *                           description: user was created date
 *                           example: 2023-07-07T11:41:51.543Z
 *       400:
 *           description: Invalid ID supplied 
 *       404:
 *           description: Pet not found
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new pet to the store.
 *     requestBody:
 *       description: Create a new pet in the store
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             
 *             properties:
 *              name:
 *                 type: string
 *                 description: the name user (Auto generate)
 *                 example: jamshid
 *              email:
 *                 type: string
 *                 description: the email user (Auto generate)
 *                 example: jamshid@gmail.com
 *              photo:
 *                 type: string
 *                 description: the photo user
 *                 example: example.jpg
 *              password:
 *                 type: string
 *                 description: the password user
 *                 example: test1234
 *              passwordConfirm:
 *                 type: string
 *                 description: the passwordConfirm user
 *                 example: test1234
 *     responses:
 *       200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                         id:
 *                           type: string
 *                           description: the id user (Auto generate)
 *                           example: d4f439e4-e936-48a0-94a7-13d1eab9de8e
 *                         name:
 *                           type: string
 *                           description: the name user (Auto generate)
 *                           example: jamshid
 *                         email:
 *                           type: string
 *                           description: the email user (Auto generate)
 *                           example: jamshid@gmail.com
 *                         photo:
 *                           type: string
 *                           description: the photo user
 *                           example: example.jpg
 *                         passwordChangedDate:
 *                           type: date
 *                           description: user was created date
 *                           example: 2023-07-07T11:41:51.543Z
 *       400:
 *          description: Invalid input
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete users
 *     description: delete user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Pet id to delete
 *         schema:
 *           type: string
 *     responses:
 *       400:
 *          description: Invalid pet value
 *          
 */


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     description: This can only be done by the logged in user.
 *     parameters:
 *       - in: put
 *         name: id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Update an existent user in the store
 *             properties:
 *              name:
 *                 type: string
 *                 description: the name user (Auto generate)
 *                 example: jamshid
 *              email:
 *                 type: string
 *                 description: the email user (Auto generate)
 *                 example: jamshid@gmail.com
 *              photo:
 *                 type: string
 *                 description: the photo user
 *                 example: example.jpg
 *              password:
 *                 type: string
 *                 description: the password user
 *                 example: test1234
 *              passwordConfirm:
 *                 type: string
 *                 description: the passwordConfirm user
 *                 example: test1234
 *     responses:
 *       200:
 *          description: Successful operation
 */



