module.exports = {
    selectedSkills: (selected = [], options) =>{
        const skills = ['HTML5','CSS3', 'CSSGrid', 'Flexbox', 'Javascript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'Typescript', 'PHP', 'Laravel', 'Sympfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Moongose', 'SQL', 'MVC', 'SASS', 'WordPress']

        let html = ``
        skills.forEach(skill =>{
            html += `
                <li class="${selected.includes(skill) ? 'activo' : ''}">${skill}</li>
            `
        })

        return options.fn().html = html;
    },
    typeContract: (select, options)=>{
        return options.fn(this).replace(
            new RegExp(` value="${select}"`), '$& selected="selected"'
        )
    }
}