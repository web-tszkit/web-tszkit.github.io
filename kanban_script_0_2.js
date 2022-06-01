Element.prototype.enableDropDelete = function (dragoverRender, dragleaveRender, dropRender) {
    this.addEventListener("dragover", function (ev) {
        ev.preventDefault();
        dragoverRender && dragoverRender(this);
    })
    this.addEventListener("dragleave", function (ev) {
        ev.preventDefault();
        dragleaveRender && dragleaveRender(this);
    })
    this.addEventListener("drop", function (ev) {
        ev.preventDefault();
        const id = ev.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(id);
        draggable.remove();
        dropRender && dropRender(this, draggable);
    })
}
Element.prototype.enableDrag = function (dragstartRender, dragendRender) {
    this.addEventListener("dragstart", function (ev) {
        ev.dataTransfer.setData('text/plain', ev.target.id);

        const draggableGhost = this.cloneNode(true);
        draggableGhost.id = "draggableGhost";
        draggableGhost.style.position = "relative";
        draggableGhost.style.left = "-500vw";
        this.parentNode.append(draggableGhost);
        ev.dataTransfer.setDragImage(draggableGhost, this.clientWidth / 2, this.clientHeight / 2);

        dragstartRender && dragstartRender(this);
    })
    this.addEventListener("dragend", function (ev) {
        const draggableGhost = document.getElementById("draggableGhost");
        draggableGhost.remove();
        dragendRender && dragendRender(this);
    })
}

let faded_out_opacity = 0.3;

window.addEventListener('DOMContentLoaded', () => {
    const element = document.querySelectorAll(".card");
    element.forEach(e => {
        e.enableDrag(function (draggable) {
            const nav = document.querySelectorAll("nav," +
                "#tool_bar :not(#btn_del_card)," +
                "#kanban_board>.col>:not(.col_header)");
            nav.forEach(e => {
                e.style.opacity = faded_out_opacity;
            });

            const tool_bar = document.querySelectorAll("#tool_bar :not(#btn_del_card, #tool_bar_backbone)");
            tool_bar.forEach(e => e.style.display = "none");

            const btn_del_card = document.querySelector("#btn_del_card");
            btn_del_card.style.width = "90vw";
        }, function (draggable) {
            const all = document.querySelectorAll('*');
            all.forEach(e => {
                e.style.opacity = 1;
            });

            const tool_bar = document.querySelectorAll("#tool_bar>:not(#btn_del_card, #tool_bar_backbone)");
            tool_bar.forEach(e => e.style.display = "inline-block");

            const btn_del_card = document.querySelector("#btn_del_card");
            btn_del_card.style.width = "6em";
        })
    })

    const btn_del_card = document.querySelector("#btn_del_card");
    btn_del_card.enableDropDelete(function (dropzone) {
        dropzone.style.borderStyle = "inset";
        dropzone.style.borderWidth = "0.1em";
        dropzone.style.borderColor = "black";
    }, function (dropzone) {
        dropzone.style.borderStyle = "none";
    }, function (dropzone) {
        dropzone.style.borderStyle = "none";
    })

    const kanban_col = document.querySelectorAll("#kanban_board>li.col");
    kanban_col.forEach(e => e.enableDropDelete(function (dropzone) {
        dropzone.style.borderStyle = "inset";
        dropzone.style.borderWidth = "0.12em";
    }, function (dropzone) {
        dropzone.style.borderStyle = "solid";
        dropzone.style.borderWidth = "0.08em";
    }, function (dropzone, draggable) {
        dropzone.style.borderStyle = "solid";
        dropzone.style.borderWidth = "0.08em";
        dropzone.querySelector(".card_zone").append(draggable);
    }));
});

