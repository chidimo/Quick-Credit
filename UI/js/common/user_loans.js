import { Formatter } from './utils.js';

const table_ref = document.getElementById('user_loans_items');

const user_loans = JSON.parse(localStorage.user_loans);

for (const [ i, loan ] of user_loans.entries()) {
    const date = new Date(loan.createdon);
    let class_;
    if (loan.status === 'approved') class_ = 'approved_loan';
    else if (loan.status === 'rejected') class_ = 'rejected_loan';
    const data = `
    <tr>
        <td><a href="./loan.html">${i + 1}</a></td>
        
        <td><a href="./loan.html"><time>${date.toDateString()}</time></a></td>
        <td class=${class_}>
            <a class='capitalize' href="./loan.html">${loan.status}</a>
        </td>
        <td><a href="./loan.html">
            ${Formatter.format(Number(loan.amount))}</a></td>
    </tr>
    `;
    table_ref.insertRow(-1).innerHTML = data;
}